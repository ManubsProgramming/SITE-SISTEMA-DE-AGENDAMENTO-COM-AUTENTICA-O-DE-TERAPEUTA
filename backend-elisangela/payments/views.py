import hashlib
import hmac
import logging
import secrets

from datetime import timedelta

from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from customers.models import Customer
from payments.models import Payment, WebhookEvent
from payments.serializers import CreatePaymentSerializer
from payments.services.asaas import AsaasAPIError, AsaasClient


logger = logging.getLogger(__name__)


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "service": "backend-elisangela",
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def create_payment(request):
    serializer = CreatePaymentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    data = serializer.validated_data
    client = AsaasClient()

    try:
        customer = Customer.objects.filter(
            email=data["email"]
        ).first()

        if customer is None:
            customer = Customer.objects.create(
                name=data["name"],
                email=data["email"],
                phone=data["phone"],
            )
        else:
            customer.name = data["name"]
            customer.phone = data["phone"]

            customer.save(
                update_fields=[
                    "name",
                    "phone",
                    "updated_at",
                ]
            )

        if not customer.asaas_customer_id:
            asaas_customer = client.create_customer(
                name=customer.name,
                email=customer.email,
                phone=customer.phone,
                cpf_cnpj=data["cpf"],
                external_reference=str(customer.id),
            )

            customer.asaas_customer_id = (
                asaas_customer["id"]
            )

            customer.save(
                update_fields=[
                    "asaas_customer_id",
                    "updated_at",
                ]
            )

        asaas_payment = client.create_pix_payment(
            customer_id=customer.asaas_customer_id,
            value=settings.SESSION_PRICE,
        )

        pix = client.get_pix_qr_code(
            asaas_payment["id"]
        )

        payment = Payment.objects.create(
            customer=customer,
            asaas_payment_id=asaas_payment["id"],
            value=settings.SESSION_PRICE,
            status=Payment.Status.PENDING,
            pix_payload=pix.get("payload", ""),
            qr_code=pix.get("encodedImage", ""),
            display_expires_at=(
                timezone.now()
                + timedelta(minutes=5)
            ),
        )

    except AsaasAPIError as error:
        logger.error(
            "Erro ao gerar Pix no Asaas: %s",
            error,
        )

        detail = (
            str(error)
            if settings.DEBUG
            else "Não foi possível gerar o Pix."
        )

        return Response(
            {"detail": detail},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    return Response(
        {
            "payment_id": str(payment.id),
            "status": payment.status,
            "value": str(payment.value),
            "pix_copy_paste": payment.pix_payload,
            "qr_code": payment.qr_code,
            "display_expires_at": (
                payment.display_expires_at.isoformat()
            ),
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
@permission_classes([AllowAny])
def payment_status(request, payment_id):
    payment = get_object_or_404(
        Payment,
        id=payment_id,
    )

    client = AsaasClient()

    try:
        asaas_payment = client.get_payment(
            payment.asaas_payment_id
        )
    except AsaasAPIError as error:
        logger.error(
            "Erro ao consultar pagamento no Asaas: %s",
            error,
        )

        return Response(
            {
                "detail": (
                    "Não foi possível consultar o pagamento."
                )
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    asaas_status = asaas_payment.get("status")

    status_mapping = {
        "PENDING": Payment.Status.PENDING,
        "CONFIRMED": Payment.Status.PROCESSING,
        "RECEIVED": Payment.Status.PAID,
        "OVERDUE": Payment.Status.EXPIRED,
        "REFUNDED": Payment.Status.REFUNDED,
        "PARTIALLY_REFUNDED": (
            Payment.Status.REFUNDED
        ),
        "DELETED": Payment.Status.CANCELLED,
    }

    new_status = status_mapping.get(
        asaas_status,
        payment.status,
    )

    if new_status != payment.status:
        payment.status = new_status

        if (
            new_status == Payment.Status.PAID
            and payment.paid_at is None
        ):
            payment.paid_at = timezone.now()

        if new_status in {
            Payment.Status.EXPIRED,
            Payment.Status.CANCELLED,
            Payment.Status.REFUNDED,
        }:
            payment.access_token_hash = ""
            payment.access_expires_at = None

        payment.save(
            update_fields=[
                "status",
                "paid_at",
                "access_token_hash",
                "access_expires_at",
                "updated_at",
            ]
        )

    return Response(
        {
            "payment_id": str(payment.id),
            "status": payment.status,
            "asaas_status": asaas_status,
            "anamnesis_released": (
                payment.status == Payment.Status.PAID
            ),
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def create_anamnesis_access(request, payment_id):
    payment = get_object_or_404(
        Payment,
        id=payment_id,
    )

    client = AsaasClient()

    try:
        asaas_payment = client.get_payment(
            payment.asaas_payment_id
        )
    except AsaasAPIError as error:
        logger.error(
            "Erro ao validar pagamento para anamnese: %s",
            error,
        )

        return Response(
            {
                "detail": (
                    "Não foi possível validar o pagamento."
                )
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if asaas_payment.get("status") != "RECEIVED":
        return Response(
            {
                "detail": (
                    "O pagamento ainda não foi recebido."
                )
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    if payment.access_used_at:
        return Response(
            {
                "detail": (
                    "A anamnese deste pagamento já foi enviada."
                )
            },
            status=status.HTTP_409_CONFLICT,
        )

    raw_token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    payment.status = Payment.Status.PAID
    payment.access_token_hash = token_hash
    payment.access_expires_at = (
        timezone.now()
        + timedelta(
            minutes=settings.ANAMNESIS_ACCESS_MINUTES
        )
    )

    if payment.paid_at is None:
        payment.paid_at = timezone.now()

    payment.save(
        update_fields=[
            "status",
            "access_token_hash",
            "access_expires_at",
            "paid_at",
            "updated_at",
        ]
    )

    return Response(
        {
            "access_token": raw_token,
            "expires_at": (
                payment.access_expires_at.isoformat()
            ),
            "form_url": "/anamnese/formulario",
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def asaas_webhook(request):
    received_token = request.headers.get(
        "asaas-access-token",
        "",
    )

    expected_token = settings.ASAAS_WEBHOOK_TOKEN

    token_is_valid = (
        bool(received_token)
        and bool(expected_token)
        and hmac.compare_digest(
            received_token,
            expected_token,
        )
    )

    if not token_is_valid:
        return Response(
            {
                "detail": "Token do webhook inválido."
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )

    event_id = request.data.get("id")
    event_type = request.data.get("event")
    payment_data = request.data.get("payment") or {}
    asaas_payment_id = payment_data.get("id")

    if (
        not event_id
        or not event_type
        or not asaas_payment_id
    ):
        return Response(
            {
                "detail": "Evento de pagamento inválido."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    with transaction.atomic():
        event_exists = WebhookEvent.objects.filter(
            id=event_id
        ).exists()

        if event_exists:
            return Response(
                {
                    "status": "ignored",
                    "reason": "duplicate",
                },
                status=status.HTTP_200_OK,
            )

        payment = (
            Payment.objects
            .select_for_update()
            .filter(
                asaas_payment_id=asaas_payment_id
            )
            .first()
        )

        WebhookEvent.objects.create(
            id=event_id,
            event_type=event_type,
        )

        if payment:
            status_mapping = {
                "PAYMENT_CREATED": (
                    Payment.Status.PENDING
                ),
                "PAYMENT_CONFIRMED": (
                    Payment.Status.PROCESSING
                ),
                "PAYMENT_RECEIVED": (
                    Payment.Status.PAID
                ),
                "PAYMENT_OVERDUE": (
                    Payment.Status.EXPIRED
                ),
                "PAYMENT_DELETED": (
                    Payment.Status.CANCELLED
                ),
                "PAYMENT_REFUNDED": (
                    Payment.Status.REFUNDED
                ),
                "PAYMENT_PARTIALLY_REFUNDED": (
                    Payment.Status.REFUNDED
                ),
                "PAYMENT_REFUND_IN_PROGRESS": (
                    Payment.Status.REFUNDED
                ),
            }

            new_status = status_mapping.get(
                event_type
            )

            if new_status:
                payment.status = new_status

                if (
                    new_status == Payment.Status.PAID
                    and payment.paid_at is None
                ):
                    payment.paid_at = timezone.now()

                if new_status in {
                    Payment.Status.EXPIRED,
                    Payment.Status.CANCELLED,
                    Payment.Status.REFUNDED,
                }:
                    payment.access_token_hash = ""
                    payment.access_expires_at = None

                payment.save(
                    update_fields=[
                        "status",
                        "paid_at",
                        "access_token_hash",
                        "access_expires_at",
                        "updated_at",
                    ]
                )

    return Response(
        {
            "status": "processed",
            "payment_found": payment is not None,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def renew_payment(request, payment_id):
    with transaction.atomic():
        payment = get_object_or_404(
            Payment.objects.select_for_update(),
            id=payment_id,
        )

        if payment.access_used_at:
            return Response(
                {
                    "detail": (
                        "A anamnese deste pagamento já foi enviada."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        now = timezone.now()

        if (
            payment.display_expires_at
            and payment.display_expires_at > now
        ):
            return Response(
                {
                    "detail": (
                        "O Pix atual ainda não expirou."
                    ),
                    "display_expires_at": (
                        payment.display_expires_at.isoformat()
                    ),
                },
                status=status.HTTP_409_CONFLICT,
            )

        client = AsaasClient()

        try:
            current_payment = client.get_payment(
                payment.asaas_payment_id
            )

            current_status = current_payment.get(
                "status"
            )

            if current_status == "RECEIVED":
                payment.status = Payment.Status.PAID

                if payment.paid_at is None:
                    payment.paid_at = now

                payment.save(
                    update_fields=[
                        "status",
                        "paid_at",
                        "updated_at",
                    ]
                )

                return Response(
                    {
                        "detail": (
                            "O pagamento já foi recebido."
                        ),
                        "status": Payment.Status.PAID,
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            if current_status == "CONFIRMED":
                payment.status = (
                    Payment.Status.PROCESSING
                )

                payment.save(
                    update_fields=[
                        "status",
                        "updated_at",
                    ]
                )

                return Response(
                    {
                        "detail": (
                            "O pagamento está em processamento."
                        ),
                        "status": Payment.Status.PROCESSING,
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            if current_status not in {
                "DELETED",
                "REFUNDED",
            }:
                client.delete_payment(
                    payment.asaas_payment_id
                )

            new_asaas_payment = (
                client.create_pix_payment(
                    customer_id=(
                        payment.customer.asaas_customer_id
                    ),
                    value=settings.SESSION_PRICE,
                )
            )

            pix = client.get_pix_qr_code(
                new_asaas_payment["id"]
            )

        except AsaasAPIError as error:
            logger.error(
                "Erro ao renovar Pix no Asaas: %s",
                error,
            )

            return Response(
                {
                    "detail": (
                        str(error)
                        if settings.DEBUG
                        else "Não foi possível renovar o Pix."
                    )
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        payment.asaas_payment_id = (
            new_asaas_payment["id"]
        )
        payment.value = settings.SESSION_PRICE
        payment.status = Payment.Status.PENDING
        payment.pix_payload = pix.get("payload", "")
        payment.qr_code = pix.get("encodedImage", "")
        payment.display_expires_at = (
            now + timedelta(minutes=5)
        )
        payment.paid_at = None
        payment.access_token_hash = ""
        payment.access_expires_at = None

        payment.save(
            update_fields=[
                "asaas_payment_id",
                "value",
                "status",
                "pix_payload",
                "qr_code",
                "display_expires_at",
                "paid_at",
                "access_token_hash",
                "access_expires_at",
                "updated_at",
            ]
        )

    return Response(
        {
            "payment_id": str(payment.id),
            "status": payment.status,
            "value": str(payment.value),
            "pix_copy_paste": payment.pix_payload,
            "qr_code": payment.qr_code,
            "display_expires_at": (
                payment.display_expires_at.isoformat()
            ),
        },
        status=status.HTTP_200_OK,
    )