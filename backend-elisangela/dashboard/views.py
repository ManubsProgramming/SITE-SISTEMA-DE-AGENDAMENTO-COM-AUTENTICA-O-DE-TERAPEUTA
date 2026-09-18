import hashlib
import json
import secrets

from datetime import timedelta

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Max, Q, Sum
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify
from django.views.decorators.csrf import (
    csrf_protect,
    ensure_csrf_cookie,
)
from django.views.decorators.http import (
    require_GET,
    require_POST,
)

from anamnesis.models import (
    Anamnesis,
    AnamnesisInvitation,
)
from anamnesis.pdf import generate_anamnesis_pdf
from customers.models import Customer
from payments.models import Payment


def is_therapist(request):
    return (
        request.user.is_authenticated
        and request.user.is_active
        and request.user.is_staff
    )


def get_anamnesis_customer(anamnesis):
    if anamnesis.customer_id:
        return anamnesis.customer

    if anamnesis.payment_id:
        return anamnesis.payment.customer

    return None


@require_GET
@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({
        "csrfToken": get_token(request),
    })


@require_POST
@csrf_protect
def therapist_login(request):
    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"detail": "Dados inválidos."},
            status=400,
        )

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return JsonResponse(
            {"detail": "Informe o usuário e a senha."},
            status=400,
        )

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if (
        user is None
        or not user.is_active
        or not user.is_staff
    ):
        return JsonResponse(
            {"detail": "Usuário ou senha inválidos."},
            status=401,
        )

    login(request, user)

    return JsonResponse({
        "authenticated": True,
        "user": {
            "username": user.username,
            "name": (
                user.get_full_name()
                or user.username
            ),
            "email": user.email,
        },
    })


@require_POST
@csrf_protect
def therapist_logout(request):
    logout(request)

    return JsonResponse({
        "authenticated": False,
    })


@require_GET
def current_therapist(request):
    if not is_therapist(request):
        return JsonResponse(
            {
                "authenticated": False,
                "detail": "Autenticação necessária.",
            },
            status=401,
        )

    user = request.user

    return JsonResponse({
        "authenticated": True,
        "user": {
            "username": user.username,
            "name": (
                user.get_full_name()
                or user.username
            ),
            "email": user.email,
        },
    })


@require_GET
def dashboard_summary(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    received_total = (
        Payment.objects
        .filter(status=Payment.Status.PAID)
        .aggregate(total=Sum("value"))["total"]
        or 0
    )

    recent_payments = (
        Payment.objects
        .select_related("customer")
        .order_by("-created_at")[:5]
    )

    return JsonResponse({
        "summary": {
            "customers": Customer.objects.count(),
            "payments": Payment.objects.count(),
            "pending_payments": (
                Payment.objects.filter(
                    status=Payment.Status.PENDING,
                ).count()
            ),
            "paid_payments": (
                Payment.objects.filter(
                    status=Payment.Status.PAID,
                ).count()
            ),
            "anamneses": Anamnesis.objects.count(),
            "received_total": str(received_total),
        },
        "recent_payments": [
            {
                "id": str(payment.id),
                "customer_name": payment.customer.name,
                "customer_email": payment.customer.email,
                "value": str(payment.value),
                "status": payment.status,
                "created_at": (
                    payment.created_at.isoformat()
                ),
                "paid_at": (
                    payment.paid_at.isoformat()
                    if payment.paid_at
                    else None
                ),
            }
            for payment in recent_payments
        ],
    })


@require_GET
def dashboard_payments(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    search = request.GET.get("search", "").strip()
    payment_status = (
        request.GET
        .get("status", "")
        .strip()
        .upper()
    )

    payments = (
        Payment.objects
        .select_related("customer")
        .order_by("-created_at")
    )

    if search:
        payments = payments.filter(
            customer__name__icontains=search,
        )

    valid_statuses = {
        choice.value
        for choice in Payment.Status
    }

    if payment_status in valid_statuses:
        payments = payments.filter(
            status=payment_status
        )

    payments = payments[:100]

    return JsonResponse({
        "payments": [
            {
                "id": str(payment.id),
                "asaas_payment_id": (
                    payment.asaas_payment_id
                ),
                "customer": {
                    "id": str(payment.customer.id),
                    "name": payment.customer.name,
                    "email": payment.customer.email,
                    "phone": payment.customer.phone,
                },
                "value": str(payment.value),
                "status": payment.status,
                "created_at": (
                    payment.created_at.isoformat()
                ),
                "paid_at": (
                    payment.paid_at.isoformat()
                    if payment.paid_at
                    else None
                ),
                "display_expires_at": (
                    payment.display_expires_at.isoformat()
                    if payment.display_expires_at
                    else None
                ),
            }
            for payment in payments
        ],
    })


@require_GET
def dashboard_customers(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    search = request.GET.get("search", "").strip()

    customers = (
        Customer.objects
        .annotate(
            payment_count=Count(
                "payments",
                distinct=True,
            ),
            anamnesis_count=Count(
                "anamneses",
                distinct=True,
            ),
            last_payment_at=Max(
                "payments__created_at"
            ),
        )
        .order_by("-created_at")
    )

    if search:
        customers = customers.filter(
            Q(name__icontains=search)
            | Q(email__icontains=search)
            | Q(phone__icontains=search)
        )

    customers = customers[:100]

    return JsonResponse({
        "customers": [
            {
                "id": str(customer.id),
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
                "payment_count": (
                    customer.payment_count
                ),
                "anamnesis_count": (
                    customer.anamnesis_count
                ),
                "created_at": (
                    customer.created_at.isoformat()
                ),
                "last_payment_at": (
                    customer.last_payment_at.isoformat()
                    if customer.last_payment_at
                    else None
                ),
            }
            for customer in customers
        ],
    })


@require_GET
def dashboard_anamneses(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    search = request.GET.get("search", "").strip()

    anamneses = (
        Anamnesis.objects
        .select_related(
            "customer",
            "invitation",
            "payment",
            "payment__customer",
        )
        .order_by("-submitted_at")
    )

    if search:
        anamneses = anamneses.filter(
            Q(customer__name__icontains=search)
            | Q(customer__email__icontains=search)
            | Q(
                payment__customer__name__icontains=search
            )
            | Q(
                payment__customer__email__icontains=search
            )
        )

    anamneses = anamneses[:100]

    results = []

    for anamnesis in anamneses:
        customer = get_anamnesis_customer(anamnesis)

        if customer is None:
            continue

        results.append({
            "id": str(anamnesis.id),
            "customer": {
                "id": str(customer.id),
                "name": customer.name,
                "email": customer.email,
                "phone": customer.phone,
            },
            "payment_id": (
                str(anamnesis.payment_id)
                if anamnesis.payment_id
                else None
            ),
            "invitation_id": (
                str(anamnesis.invitation_id)
                if anamnesis.invitation_id
                else None
            ),
            "form_version": anamnesis.form_version,
            "submitted_at": (
                anamnesis.submitted_at.isoformat()
            ),
        })

    return JsonResponse({
        "anamneses": results,
    })


@require_GET
def dashboard_anamnesis_detail(
    request,
    anamnesis_id,
):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    anamnesis = get_object_or_404(
        Anamnesis.objects.select_related(
            "customer",
            "invitation",
            "payment",
            "payment__customer",
        ),
        id=anamnesis_id,
    )

    customer = get_anamnesis_customer(anamnesis)

    if customer is None:
        return JsonResponse(
            {"detail": "Cliente não identificado."},
            status=404,
        )

    payment_data = None

    if anamnesis.payment_id:
        payment_data = {
            "value": str(anamnesis.payment.value),
            "status": anamnesis.payment.status,
            "paid_at": (
                anamnesis.payment.paid_at.isoformat()
                if anamnesis.payment.paid_at
                else None
            ),
        }

    return JsonResponse({
        "id": str(anamnesis.id),
        "payment_id": (
            str(anamnesis.payment_id)
            if anamnesis.payment_id
            else None
        ),
        "invitation_id": (
            str(anamnesis.invitation_id)
            if anamnesis.invitation_id
            else None
        ),
        "form_version": anamnesis.form_version,
        "submitted_at": (
            anamnesis.submitted_at.isoformat()
        ),
        "answers": anamnesis.answers,
        "customer": {
            "id": str(customer.id),
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
        },
        "payment": payment_data,
    })


@require_GET
def dashboard_anamnesis_pdf(
    request,
    anamnesis_id,
):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    anamnesis = get_object_or_404(
        Anamnesis.objects.select_related(
            "customer",
            "invitation",
            "payment",
            "payment__customer",
        ),
        id=anamnesis_id,
    )

    customer = get_anamnesis_customer(anamnesis)

    if customer is None:
        return JsonResponse(
            {"detail": "Cliente não identificado."},
            status=404,
        )

    pdf_content = generate_anamnesis_pdf(anamnesis)

    customer_name = (
        slugify(customer.name)
        or "cliente"
    )

    filename = (
        f"anamnese-{customer_name}-"
        f"{anamnesis.id}.pdf"
    )

    response = HttpResponse(
        pdf_content,
        content_type="application/pdf",
    )

    response["Content-Disposition"] = (
        f'attachment; filename="{filename}"'
    )
    response["Cache-Control"] = "private, no-store"
    response["X-Content-Type-Options"] = "nosniff"

    return response


@require_POST
@csrf_protect
def create_anamnesis_invitation(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    try:
        data = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse(
            {"detail": "Dados inválidos."},
            status=400,
        )

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    phone = data.get("phone", "").strip()

    if not name or not email or not phone:
        return JsonResponse(
            {
                "detail": (
                    "Informe nome, e-mail e telefone."
                )
            },
            status=400,
        )

    customer = Customer.objects.filter(
        email__iexact=email
    ).first()

    if customer is None:
        customer = Customer.objects.create(
            name=name,
            email=email,
            phone=phone,
        )
    else:
        customer.name = name
        customer.phone = phone

        customer.save(
            update_fields=[
                "name",
                "phone",
                "updated_at",
            ]
        )

    raw_token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    invitation = AnamnesisInvitation.objects.create(
        customer=customer,
        token_hash=token_hash,
        expires_at=(
            timezone.now()
            + timedelta(days=7)
        ),
        created_by=request.user,
    )

    frontend_url = settings.FRONTEND_URL.rstrip("/")

    form_url = (
        f"{frontend_url}/anamnese"
        f"?invitation_id={invitation.id}"
        f"&access_token={raw_token}"
    )

    return JsonResponse(
        {
            "invitation_id": str(invitation.id),
            "customer_id": str(customer.id),
            "expires_at": (
                invitation.expires_at.isoformat()
            ),
            "form_url": form_url,
        },
        status=201,
    )