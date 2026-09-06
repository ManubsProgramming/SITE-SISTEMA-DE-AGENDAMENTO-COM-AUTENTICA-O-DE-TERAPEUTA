from django.urls import path

from .views import (
    anamnesis_schema,
    download_anamnesis_pdf,
    submit_anamnesis,
)


urlpatterns = [
    path(
        "anamnesis/schema/",
        anamnesis_schema,
        name="anamnesis-schema",
    ),
    path(
        "anamnesis/submit/",
        submit_anamnesis,
        name="submit-anamnesis",
    ),
    path(
        "anamnesis/<uuid:anamnesis_id>/pdf/",
        download_anamnesis_pdf,
        name="download-anamnesis-pdf",
    ),
]