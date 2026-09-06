from django.contrib import admin

from .models import Customer


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "created_at",
    )
    search_fields = (
        "name",
        "email",
        "phone",
        "asaas_customer_id",
    )
    readonly_fields = (
        "id",
        "asaas_customer_id",
        "created_at",
        "updated_at",
    )