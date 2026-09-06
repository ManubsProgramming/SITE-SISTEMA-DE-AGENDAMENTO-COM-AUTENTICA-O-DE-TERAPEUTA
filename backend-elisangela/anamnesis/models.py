# anamnesis/models.py
import uuid

from django.db import models


class Anamnesis(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    payment = models.OneToOneField(
        "payments.Payment",
        on_delete=models.PROTECT,
        related_name="anamnesis",
    )
    form_version = models.CharField(
        max_length=20,
        default="1.0",
    )
    answers = models.JSONField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "anamnese"
        verbose_name_plural = "anamneses"
        ordering = ["-submitted_at"]

    def __str__(self):
        return f"Anamnese — {self.payment.customer.name}"