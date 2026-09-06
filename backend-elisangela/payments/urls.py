from django.urls import path

from .views import (
    asaas_webhook,
    create_anamnesis_access,
    create_payment,
    health_check,
    payment_status,
     renew_payment,

)


urlpatterns = [
    path(
        "health/",
        health_check,
        name="health-check",
    ),
    path(
        "payments/",
        create_payment,
        name="create-payment",
    ),
    path(
        "payments/<uuid:payment_id>/status/",
        payment_status,
        name="payment-status",
    ),
    path(
        "payments/<uuid:payment_id>/anamnesis-access/",
        create_anamnesis_access,
        name="create-anamnesis-access",
    ),
    path(
        "webhooks/asaas/",
        asaas_webhook,
        name="asaas-webhook",
    ),
    path(
    "payments/<uuid:payment_id>/renew/",
     renew_payment,
    name="renew-payment",
),
]