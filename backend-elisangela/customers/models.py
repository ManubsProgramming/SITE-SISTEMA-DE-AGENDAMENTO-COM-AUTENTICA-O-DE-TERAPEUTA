import uuid

from django.db import models


class Customer(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    name = models.CharField("nome", max_length=150)
    email = models.EmailField("e-mail", db_index=True)
    phone = models.CharField("telefone", max_length=20, db_index=True)
    asaas_customer_id = models.CharField(
        "ID no Asaas",
        max_length=100,
        blank=True,
        null=True,
        unique=True,
    )
    created_at = models.DateTimeField("cadastrado em", auto_now_add=True)
    updated_at = models.DateTimeField("atualizado em", auto_now=True)
    class Meta:
        verbose_name = "cliente"
        verbose_name_plural = "clientes"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.email}"