import uuid

from django.conf import settings
from django.db import models


class AnamnesisInvitation(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="anamnesis_invitations",
        verbose_name="cliente",
    )

    token_hash = models.CharField(
        "hash do token",
        max_length=64,
    )

    expires_at = models.DateTimeField(
        "expira em",
    )

    used_at = models.DateTimeField(
        "utilizado em",
        null=True,
        blank=True,
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="anamnesis_invitations",
        null=True,
        blank=True,
        verbose_name="criado por",
    )

    created_at = models.DateTimeField(
        "criado em",
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "convite de anamnese"
        verbose_name_plural = "convites de anamnese"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Convite — {self.customer.name}"


class Anamnesis(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="anamneses",
        null=True,
        blank=True,
        verbose_name="cliente",
    )

    payment = models.OneToOneField(
        "payments.Payment",
        on_delete=models.PROTECT,
        related_name="anamnesis",
        null=True,
        blank=True,
        verbose_name="pagamento antigo",
    )

    invitation = models.OneToOneField(
        AnamnesisInvitation,
        on_delete=models.PROTECT,
        related_name="anamnesis",
        null=True,
        blank=True,
        verbose_name="convite",
    )

    form_version = models.CharField(
        max_length=20,
        default="1.0",
    )

    answers = models.JSONField()

    submitted_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "anamnese"
        verbose_name_plural = "anamneses"
        ordering = ["-submitted_at"]

    def __str__(self):
        customer = self.customer

        if customer is None and self.payment_id:
            customer = self.payment.customer

        customer_name = (
            customer.name
            if customer is not None
            else "Cliente não identificado"
        )

        return f"Anamnese — {customer_name}"