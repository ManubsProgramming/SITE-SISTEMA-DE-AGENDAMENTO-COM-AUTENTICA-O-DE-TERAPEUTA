import json

from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Max, Q, Sum
from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404
from anamnesis.models import Anamnesis
from customers.models import Customer
from payments.models import Payment
from django.utils.text import slugify

from anamnesis.pdf import generate_anamnesis_pdf

def is_therapist(request):
    return (
        request.user.is_authenticated
        and request.user.is_active
        and request.user.is_staff
    )


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

    if user is None or not user.is_active or not user.is_staff:
        return JsonResponse(
            {"detail": "Usuário ou senha inválidos."},
            status=401,
        )

    login(request, user)

    return JsonResponse({
        "authenticated": True,
        "user": {
            "username": user.username,
            "name": user.get_full_name() or user.username,
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
            "name": user.get_full_name() or user.username,
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
            "pending_payments": Payment.objects.filter(
                status=Payment.Status.PENDING,
            ).count(),
            "paid_payments": Payment.objects.filter(
                status=Payment.Status.PAID,
            ).count(),
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
                "created_at": payment.created_at.isoformat(),
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
    payment_status = request.GET.get("status", "").strip().upper()

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
        payments = payments.filter(status=payment_status)

    payments = payments[:100]

    return JsonResponse({
        "payments": [
            {
                "id": str(payment.id),
                "asaas_payment_id": payment.asaas_payment_id,
                "customer": {
                    "id": str(payment.customer.id),
                    "name": payment.customer.name,
                    "email": payment.customer.email,
                    "phone": payment.customer.phone,
                },
                "value": str(payment.value),
                "status": payment.status,
                "created_at": payment.created_at.isoformat(),
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
            payment_count=Count("payments"),
            last_payment_at=Max("payments__created_at"),
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
                "payment_count": customer.payment_count,
                "created_at": customer.created_at.isoformat(),
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
        .select_related("payment", "payment__customer")
        .order_by("-submitted_at")
    )

    if search:
        anamneses = anamneses.filter(
            Q(payment__customer__name__icontains=search)
            | Q(payment__customer__email__icontains=search)
        )

    anamneses = anamneses[:100]

    return JsonResponse({
        "anamneses": [
            {
                "id": str(anamnesis.id),
                "customer": {
                    "id": str(anamnesis.payment.customer.id),
                    "name": anamnesis.payment.customer.name,
                    "email": anamnesis.payment.customer.email,
                    "phone": anamnesis.payment.customer.phone,
                },
                "payment_id": str(anamnesis.payment.id),
                "form_version": anamnesis.form_version,
                "submitted_at": anamnesis.submitted_at.isoformat(),
            }
            for anamnesis in anamneses
        ],
    })
@require_GET
def dashboard_anamnesis_detail(request, anamnesis_id):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    anamnesis = get_object_or_404(
        Anamnesis.objects.select_related(
            "payment",
            "payment__customer",
        ),
        id=anamnesis_id,
    )

    customer = anamnesis.payment.customer

    return JsonResponse({
        "id": str(anamnesis.id),
        "payment_id": str(anamnesis.payment.id),
        "form_version": anamnesis.form_version,
        "submitted_at": anamnesis.submitted_at.isoformat(),
        "answers": anamnesis.answers,
        "customer": {
            "id": str(customer.id),
            "name": customer.name,
            "email": customer.email,
            "phone": customer.phone,
        },
        "payment": {
            "value": str(anamnesis.payment.value),
            "status": anamnesis.payment.status,
            "paid_at": (
                anamnesis.payment.paid_at.isoformat()
                if anamnesis.payment.paid_at
                else None
            ),
        },
    })
@require_GET
def dashboard_anamnesis_pdf(request, anamnesis_id):
    if not is_therapist(request):
        return JsonResponse(
            {"detail": "Autenticação necessária."},
            status=401,
        )

    anamnesis = get_object_or_404(
        Anamnesis.objects.select_related(
            "payment",
            "payment__customer",
        ),
        id=anamnesis_id,
    )

    pdf_content = generate_anamnesis_pdf(anamnesis)

    customer_name = slugify(
        anamnesis.payment.customer.name
    ) or "cliente"

    filename = (
        f"anamnese-{customer_name}-{anamnesis.id}.pdf"
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