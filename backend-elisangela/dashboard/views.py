import hashlib
import json
import secrets

from datetime import timedelta

from django.conf import settings
from django.contrib.auth import (
    authenticate,
    login,
    logout,
)
from django.db.models import Count, Q
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

    if (
        anamnesis.invitation_id
        and anamnesis.invitation.customer_id
    ):
        return anamnesis.invitation.customer

    return None


def serialize_anamnesis(anamnesis):
    return {
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
    }


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
            {
                "detail": (
                    "Informe o usuário e a senha."
                )
            },
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

    customers_with_anamneses = (
        Customer.objects
        .filter(
            Q(anamneses__isnull=False)
            | Q(payments__anamnesis__isnull=False)
        )
        .distinct()
        .count()
    )

    recent_anamneses = (
        Anamnesis.objects
        .select_related(
            "customer",
            "invitation",
            "invitation__customer",
            "payment",
            "payment__customer",
        )
        .order_by("-submitted_at")[:5]
    )

    recent_results = []

    for anamnesis in recent_anamneses:
        customer = get_anamnesis_customer(
            anamnesis
        )

        if customer is None:
            continue

        recent_results.append({
            "id": str(anamnesis.id),
            "customer": {
                "id": str(customer.id),
                "name": customer.name,
                "cpf": customer.cpf or "",
                "email": customer.email,
                "phone": customer.phone,
            },
            "form_version": (
                anamnesis.form_version
            ),
            "submitted_at": (
                anamnesis.submitted_at.isoformat()
            ),
        })

    active_invitations = (
        AnamnesisInvitation.objects
        .filter(
            used_at__isnull=True,
            expires_at__gt=timezone.now(),
        )
        .count()
    )

    return JsonResponse({
        "summary": {
            "customers": customers_with_anamneses,
            "anamneses": Anamnesis.objects.count(),
            "active_invitations": active_invitations,
        },
        "recent_anamneses": recent_results,
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
            anamnesis_count=Count(
                "anamneses",
                distinct=True,
            ),
        )
        .filter(
            Q(anamnesis_count__gt=0)
            | Q(payments__anamnesis__isnull=False)
        )
        .distinct()
        .order_by("name")
    )

    if search:
        customers = customers.filter(
            Q(name__icontains=search)
            | Q(cpf__icontains=search)
            | Q(email__icontains=search)
            | Q(phone__icontains=search)
        )

    results = []

    for customer in customers[:100]:
        direct_count = (
            Anamnesis.objects
            .filter(customer=customer)
            .count()
        )

        legacy_count = (
            Anamnesis.objects
            .filter(
                customer__isnull=True,
                payment__customer=customer,
            )
            .count()
        )

        results.append({
            "id": str(customer.id),
            "name": customer.name,
            "cpf": customer.cpf or "",
            "email": customer.email,
            "phone": customer.phone,
            "anamnesis_count": (
                direct_count + legacy_count
            ),
            "created_at": (
                customer.created_at.isoformat()
            ),
        })

    return JsonResponse({
        "customers": results,
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
            "invitation__customer",
            "payment",
            "payment__customer",
        )
        .order_by("-submitted_at")
    )

    if search:
        anamneses = anamneses.filter(
            Q(customer__name__icontains=search)
            | Q(customer__cpf__icontains=search)
            | Q(customer__email__icontains=search)
            | Q(customer__phone__icontains=search)
            | Q(
                payment__customer__name__icontains=search
            )
            | Q(
                payment__customer__cpf__icontains=search
            )
            | Q(
                payment__customer__email__icontains=search
            )
            | Q(
                payment__customer__phone__icontains=search
            )
            | Q(
                invitation__customer__name__icontains=search
            )
            | Q(
                invitation__customer__cpf__icontains=search
            )
            | Q(
                invitation__customer__email__icontains=search
            )
        ).distinct()

    grouped_customers = {}

    for anamnesis in anamneses[:500]:
        customer = get_anamnesis_customer(
            anamnesis
        )

        if customer is None:
            continue

        # O CPF é a identificação principal.
        # Para clientes antigos sem CPF, usamos o ID.
        group_key = (
            f"cpf:{customer.cpf}"
            if customer.cpf
            else f"id:{customer.id}"
        )

        if group_key not in grouped_customers:
            grouped_customers[group_key] = {
                "id": str(customer.id),
                "name": customer.name,
                "cpf": customer.cpf or "",
                "email": customer.email,
                "phone": customer.phone,
                "anamnesis_count": 0,
                "last_submitted_at": (
                    anamnesis.submitted_at.isoformat()
                ),
                "anamneses": [],
            }

        group = grouped_customers[group_key]

        group["anamneses"].append(
            serialize_anamnesis(anamnesis)
        )
        group["anamnesis_count"] += 1

    results = list(grouped_customers.values())

    results.sort(
        key=lambda customer: (
            customer["last_submitted_at"]
        ),
        reverse=True,
    )

    return JsonResponse({
        "customers": results,
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
            "invitation__customer",
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

    # Mantido apenas para visualizar registros antigos.
    if anamnesis.payment_id:
        payment_data = {
            "value": str(
                anamnesis.payment.value
            ),
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
            "cpf": customer.cpf or "",
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
            "invitation__customer",
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

    pdf_content = generate_anamnesis_pdf(
        anamnesis
    )

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
    response["Cache-Control"] = (
        "private, no-store"
    )
    response["X-Content-Type-Options"] = (
        "nosniff"
    )

    return response


@require_POST
@csrf_protect
def create_anamnesis_invitation(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    raw_token = secrets.token_urlsafe(32)

    token_hash = hashlib.sha256(
        raw_token.encode("utf-8")
    ).hexdigest()

    invitation = (
        AnamnesisInvitation.objects.create(
            customer=None,
            token_hash=token_hash,
            expires_at=(
                timezone.now()
                + timedelta(days=7)
            ),
            created_by=request.user,
        )
    )

    frontend_url = (
        settings.FRONTEND_URL.rstrip("/")
    )

    form_url = (
        f"{frontend_url}/anamnese"
        f"?invitation_id={invitation.id}"
        f"&access_token={raw_token}"
    )

    return JsonResponse(
        {
            "invitation_id": str(
                invitation.id
            ),
            "expires_at": (
                invitation.expires_at.isoformat()
            ),
            "form_url": form_url,
        },
        status=201,
    )


# Rota antiga preservada temporariamente para não
# quebrar imports existentes. Ela não será exibida
# no novo painel.
@require_GET
def dashboard_payments(request):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    return JsonResponse({
        "payments": [],
    })