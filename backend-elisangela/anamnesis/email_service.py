import logging

from django.conf import settings
from django.core.mail import EmailMessage

from .models import Anamnesis
from .pdf import generate_anamnesis_pdf


logger = logging.getLogger(__name__)


def send_anamnesis_emails(anamnesis_id):
    try:
        anamnesis = (
            Anamnesis.objects
            .select_related("payment__customer")
            .get(id=anamnesis_id)
        )

        customer = anamnesis.payment.customer
        pdf_content = generate_anamnesis_pdf(anamnesis)
        filename = f"anamnese-{anamnesis.id}.pdf"

        therapist_email = EmailMessage(
            subject=f"Nova anamnese — {customer.name}",
            body=(
                f"Olá, Elisângela.\n\n"
                f"Uma nova anamnese foi enviada por "
                f"{customer.name}.\n\n"
                f"O formulário completo está anexado."
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.THERAPIST_EMAIL],
        )
        therapist_email.attach(
            filename,
            pdf_content,
            "application/pdf",
        )
        therapist_email.send(fail_silently=False)

        customer_email = EmailMessage(
            subject="Cópia da sua anamnese — Elisângela Fernandes",
            body=(
                f"Olá, {customer.name}.\n\n"
                "Recebemos sua anamnese com sucesso. "
                "Uma cópia das suas respostas está anexada.\n\n"
                "Este documento contém informações pessoais. "
                "Guarde-o em local seguro.\n\n"
                "Elisângela Fernandes\n"
                "Terapeuta Emocional"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[customer.email],
        )
        customer_email.attach(
            filename,
            pdf_content,
            "application/pdf",
        )
        customer_email.send(fail_silently=False)

        return True

    except Exception:
        logger.exception(
            "Não foi possível enviar os e-mails da anamnese %s.",
            anamnesis_id,
        )
        return False