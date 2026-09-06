from django.contrib import admin

from .models import Anamnesis


@admin.register(Anamnesis)
class AnamnesisAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer_name",
        "form_version",
        "submitted_at",
    )
    list_filter = (
        "form_version",
        "submitted_at",
    )
    search_fields = (
        "payment__customer__name",
        "payment__customer__email",
    )
    readonly_fields = (
        "id",
        "payment",
        "form_version",
        "answers",
        "submitted_at",
    )
    ordering = ("-submitted_at",)

    @admin.display(description="Cliente")
    def customer_name(self, obj):
        return obj.payment.customer.name

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False