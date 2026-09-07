from django.http import JsonResponse


def axes_lockout_response(request, *args, **kwargs):
    return JsonResponse(
        {
            "detail": (
                "Muitas tentativas de acesso. "
                "Aguarde 30 minutos e tente novamente."
            )
        },
        status=429,
    )