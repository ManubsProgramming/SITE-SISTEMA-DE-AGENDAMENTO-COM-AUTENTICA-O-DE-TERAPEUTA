from django.urls import path

from .views import (
    csrf_token,
    current_therapist,
    dashboard_anamneses,
    dashboard_anamnesis_detail,
    dashboard_anamnesis_pdf,
    dashboard_customers,
    dashboard_payments,
    dashboard_summary,
    therapist_login,
    therapist_logout,
)


urlpatterns = [
    path(
        "csrf/",
        csrf_token,
        name="dashboard-csrf",
    ),
    path(
        "login/",
        therapist_login,
        name="dashboard-login",
    ),
    path(
        "logout/",
        therapist_logout,
        name="dashboard-logout",
    ),
    path(
        "me/",
        current_therapist,
        name="dashboard-me",
    ),
    path(
        "summary/",
        dashboard_summary,
        name="dashboard-summary",
    ),
    path(
        "customers/",
        dashboard_customers,
        name="dashboard-customers",
    ),
    path(
        "payments/",
        dashboard_payments,
        name="dashboard-payments",
    ),
    path(
        "anamneses/",
        dashboard_anamneses,
        name="dashboard-anamneses",
    ),
    path(
        "anamneses/<uuid:anamnesis_id>/pdf/",
        dashboard_anamnesis_pdf,
        name="dashboard-anamnesis-pdf",
    ),
    path(
        "anamneses/<uuid:anamnesis_id>/",
        dashboard_anamnesis_detail,
        name="dashboard-anamnesis-detail",
    ),
]