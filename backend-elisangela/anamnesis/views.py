import hashlib
import hmac

from django.contrib.admin.views.decorators import (
    staff_member_required,
)
from django.db import IntegrityError, transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Anamnesis,
    AnamnesisInvitation,
)
from .pdf import generate_anamnesis_pdf
from .serializers import (
    SubmitAnamnesisSerializer,
    load_form_schema,
)


@api_view(["POST"])
@permission_classes([AllowAny])
def submit_anamnesis(request):
    serializer = SubmitAnamnesisSerializer(
        data=request.data
    )

    serializer.is_valid(
        raise_exception=True
    )

    data = serializer.validated_data

    supplied_hash = hashlib.sha256(
        data["access_token"].encode("utf-8")
    ).hexdigest()

    try:
        with transaction.atomic():
            invitation = (
                AnamnesisInvitation.objects
                .select_for_update()
                .select_related("customer")
                .get(id=data["invitation_id"])
            )

            token_is_valid = hmac.compare_digest(
                supplied_hash,
                invitation.token_hash,
            )

            if not token_is_valid:
                return Response(
                    {
                        "detail": (
                            "Token de acesso inválido."
                        )
                    },
                    status=(
                        status.HTTP_403_FORBIDDEN
                    ),
                )

            if (
                invitation.expires_at
                <= timezone.now()
            ):
                return Response(
                    {
                        "detail": (
                            "O acesso à anamnese expirou."
                        )
                    },
                    status=(
                        status.HTTP_403_FORBIDDEN
                    ),
                )

            if invitation.used_at:
                return Response(
                    {
                        "detail": (
                            "Esta anamnese já foi enviada."
                        )
                    },
                    status=(
                        status.HTTP_409_CONFLICT
                    ),
                )

            if Anamnesis.objects.filter(
                invitation=invitation
            ).exists():
                return Response(
                    {
                        "detail": (
                            "Esta anamnese já foi enviada."
                        )
                    },
                    status=(
                        status.HTTP_409_CONFLICT
                    ),
                )

            anamnesis = Anamnesis.objects.create(
                customer=invitation.customer,
                invitation=invitation,
                payment=None,
                form_version=data["form_version"],
                answers=data["answers"],
            )

            invitation.used_at = timezone.now()
            invitation.token_hash = ""

            invitation.save(
                update_fields=[
                    "used_at",
                    "token_hash",
                ]
            )

    except AnamnesisInvitation.DoesNotExist:
        return Response(
            {
                "detail": (
                    "Convite não encontrado."
                )
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    except IntegrityError:
        return Response(
            {
                "detail": (
                    "Esta anamnese já foi enviada."
                )
            },
            status=status.HTTP_409_CONFLICT,
        )

    return Response(
        {
            "anamnesis_id": str(anamnesis.id),
            "status": "submitted",
            "submitted_at": (
                anamnesis
                .submitted_at
                .isoformat()
            ),
            "message": (
                "Anamnese enviada com sucesso."
            ),
        },
        status=status.HTTP_201_CREATED,
    )


@staff_member_required
def download_anamnesis_pdf(
    request,
    anamnesis_id,
):
    anamnesis = get_object_or_404(
        Anamnesis.objects.select_related(
            "customer",
            "invitation",
            "invitation__customer",
            "payment",
            "payment__customer",
        ),
        id=anamnesis_id,
    )

    pdf_content = generate_anamnesis_pdf(
        anamnesis
    )

    response = HttpResponse(
        pdf_content,
        content_type="application/pdf",
    )

    response["Content-Disposition"] = (
        f'attachment; '
        f'filename="anamnese-{anamnesis.id}.pdf"'
    )

    response["X-Content-Type-Options"] = (
        "nosniff"
    )

    response["Cache-Control"] = (
        "private, no-store"
    )

    return response


@api_view(["GET"])
@permission_classes([AllowAny])
def anamnesis_schema(request):
    schema = load_form_schema()

    response = Response(schema)

    response["Cache-Control"] = (
        "public, max-age=3600"
    )

    return response