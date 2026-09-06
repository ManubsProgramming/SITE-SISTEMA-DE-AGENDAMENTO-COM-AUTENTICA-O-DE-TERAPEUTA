import requests

from django.conf import settings
from django.utils import timezone


class AsaasAPIError(Exception):
    pass


class AsaasClient:
    def __init__(self):
        self.base_url = settings.ASAAS_API_URL.rstrip("/")
        self.headers = {
            "access_token": settings.ASAAS_API_KEY,
            "Content-Type": "application/json",
            "User-Agent": "backend-elisangela/1.0",
        }

    def request(self, method, endpoint, **kwargs):
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                timeout=20,
                **kwargs,
            )
        except requests.RequestException as error:
            raise AsaasAPIError(
                "Não foi possível conectar ao Asaas."
            ) from error

        if not response.ok:
            try:
                details = response.json()
            except ValueError:
                details = {"message": "Resposta inválida do Asaas."}

            raise AsaasAPIError(
                f"Erro do Asaas ({response.status_code}): {details}"
            )

        return response.json()

    def delete_payment(self, payment_id):
        return self.request(
            "DELETE",
            f"/payments/{payment_id}",
        )

    def create_customer(
        self,
        *,
        name,
        email,
        phone,
        cpf_cnpj,
        external_reference,
    ):
        return self.request(
            "POST",
            "/customers",
            json={
                "name": name,
                "email": email,
                "mobilePhone": phone,
                "cpfCnpj": cpf_cnpj,
                "externalReference": external_reference,
                "notificationDisabled": True,
            },
        )

    def create_pix_payment(self, *, customer_id, value):
        return self.request(
            "POST",
            "/payments",
            json={
                "customer": customer_id,
                "billingType": "PIX",
                "value": str(value),
                "dueDate": timezone.localdate().isoformat(),
                "description": "Sessão de terapia emocional",
            },
        )

    def get_pix_qr_code(self, payment_id):
        return self.request(
            "GET",
            f"/payments/{payment_id}/pixQrCode",
        )

    def get_payment(self, payment_id):
        return self.request(
            "GET",
            f"/payments/{payment_id}",
        )