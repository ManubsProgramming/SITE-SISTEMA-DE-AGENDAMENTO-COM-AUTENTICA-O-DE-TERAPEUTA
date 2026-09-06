import hashlib
import hmac

from django.contrib.admin.views.decorators import staff_member_required
from django.db import IntegrityError, transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .serializers import (
    SubmitAnamnesisSerializer,
    load_form_schema,
)
from payments.models import Payment

from .email_service import send_anamnesis_emails
from .models import Anamnesis
from .pdf import generate_anamnesis_pdf


@api_view(["POST"])
@permission_classes([AllowAny])
def submit_anamnesis(request):
    serializer = SubmitAnamnesisSerializer(
        data=request.data
    )
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    supplied_hash = hashlib.sha256(
        data["access_token"].encode("utf-8")
    ).hexdigest()

    try:
        with transaction.atomic():
            payment = (
                Payment.objects
                .select_for_update()
                .select_related("customer")
                .get(id=data["payment_id"])
            )

            if payment.status != Payment.Status.PAID:
                return Response(
                    {
                        "detail": (
                            "O pagamento ainda não foi confirmado."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if not payment.access_token_hash:
                return Response(
                    {
                        "detail": (
                            "Acesso à anamnese não liberado."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            token_is_valid = hmac.compare_digest(
                supplied_hash,
                payment.access_token_hash,
            )

            if not token_is_valid:
                return Response(
                    {"detail": "Token de acesso inválido."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            if (
                not payment.access_expires_at
                or payment.access_expires_at <= timezone.now()
            ):
                return Response(
                    {
                        "detail": (
                            "O acesso à anamnese expirou."
                        )
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if payment.access_used_at:
                return Response(
                    {
                        "detail": (
                            "Esta anamnese já foi enviada."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            if Anamnesis.objects.filter(
                payment=payment
            ).exists():
                return Response(
                    {
                        "detail": (
                            "Esta anamnese já foi enviada."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            anamnesis = Anamnesis.objects.create(
                payment=payment,
                form_version=data["form_version"],
                answers=data["answers"],
            )

            payment.access_used_at = timezone.now()
            payment.access_token_hash = ""
            payment.save(
                update_fields=[
                    "access_used_at",
                    "access_token_hash",
                    "updated_at",
                ]
            )

            anamnesis_id = anamnesis.id

            transaction.on_commit(
                lambda: send_anamnesis_emails(
                    anamnesis_id
                )
            )

    except Payment.DoesNotExist:
        return Response(
            {"detail": "Pagamento não encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )

    except IntegrityError:
        return Response(
            {"detail": "Esta anamnese já foi enviada."},
            status=status.HTTP_409_CONFLICT,
        )

    return Response(
        {
            "anamnesis_id": str(anamnesis.id),
            "status": "submitted",
            "submitted_at": (
                anamnesis.submitted_at.isoformat()
            ),
            "message": (
                "Anamnese enviada com sucesso."
            ),
        },
        status=status.HTTP_201_CREATED,
    )


@staff_member_required
def download_anamnesis_pdf(
    request,
    anamnesis_id,
):
    anamnesis = get_object_or_404(
        Anamnesis.objects.select_related(
            "payment__customer"
        ),
        id=anamnesis_id,
    )

    pdf_content = generate_anamnesis_pdf(
        anamnesis
    )

    response = HttpResponse(
        pdf_content,
        content_type="application/pdf",
    )

    response["Content-Disposition"] = (
        f'attachment; '
        f'filename="anamnese-{anamnesis.id}.pdf"'
    )
    response["X-Content-Type-Options"] = "nosniff"
    response["Cache-Control"] = "private, no-store"

    return response

@api_view(["GET"])
@permission_classes([AllowAny])
def anamnesis_schema(request):
    schema = load_form_schema()

    response = Response(schema)
    response["Cache-Control"] = "public, max-age=3600"

    return response