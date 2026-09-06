from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "customer",
        "value",
        "status",
        "paid_at",
        "created_at",
    )
    list_filter = (
        "status",
        "created_at",
        "paid_at",
    )
    search_fields = (
        "customer__name",
        "customer__email",
        "asaas_payment_id",
    )
    readonly_fields = (
        "id",
        "asaas_payment_id",
        "pix_payload",
        "qr_code",
        "access_token_hash",
        "paid_at",
        "created_at",
        "updated_at",
        "access_expires_at",
"access_used_at",
    )