import uuid

from django.db import models


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = (
            "PENDING",
            "Aguardando pagamento",
        )
        PROCESSING = (
            "PROCESSING",
            "Pagamento em processamento",
        )
        PAID = (
            "PAID",
            "Pago",
        )
        EXPIRED = (
            "EXPIRED",
            "Expirado",
        )
        CANCELLED = (
            "CANCELLED",
            "Cancelado",
        )
        REFUNDED = (
            "REFUNDED",
            "Estornado",
        )
        FAILED = (
            "FAILED",
            "Falhou",
        )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    customer = models.ForeignKey(
        "customers.Customer",
        on_delete=models.PROTECT,
        related_name="payments",
        verbose_name="cliente",
    )

    asaas_payment_id = models.CharField(
        "ID da cobrança no Asaas",
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    value = models.DecimalField(
        "valor",
        max_digits=10,
        decimal_places=2,
    )

    status = models.CharField(
        "status",
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    pix_payload = models.TextField(
        "Pix copia e cola",
        blank=True,
    )

    qr_code = models.TextField(
        "QR Code em Base64",
        blank=True,
    )

    display_expires_at = models.DateTimeField(
        "expiração exibida",
        null=True,
        blank=True,
    )

    paid_at = models.DateTimeField(
        "pago em",
        null=True,
        blank=True,
    )

    access_token_hash = models.CharField(
        "hash do acesso à anamnese",
        max_length=128,
        blank=True,
    )

    access_expires_at = models.DateTimeField(
        "expiração do acesso",
        null=True,
        blank=True,
    )

    access_used_at = models.DateTimeField(
        "acesso utilizado em",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        "criado em",
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        "atualizado em",
        auto_now=True,
    )

    class Meta:
        verbose_name = "pagamento"
        verbose_name_plural = "pagamentos"
        ordering = ["-created_at"]

    def __str__(self):
        return (
            f"{self.customer.name} — "
            f"R$ {self.value} — "
            f"{self.get_status_display()}"
        )


class WebhookEvent(models.Model):
    id = models.CharField(
        "ID do evento",
        primary_key=True,
        max_length=100,
    )

    event_type = models.CharField(
        "tipo do evento",
        max_length=100,
    )

    received_at = models.DateTimeField(
        "recebido em",
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "evento de webhook"
        verbose_name_plural = "eventos de webhook"
        ordering = ["-received_at"]

    def __str__(self):
        return f"{self.event_type} — {self.id}"