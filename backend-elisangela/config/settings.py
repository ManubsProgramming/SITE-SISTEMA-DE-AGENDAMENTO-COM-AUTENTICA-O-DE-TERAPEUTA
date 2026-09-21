from decimal import Decimal
from pathlib import Path
import os

import environ


BASE_DIR = Path(__file__).resolve().parent.parent


env = environ.Env()
env.escape_proxy = True

environ.Env.read_env(BASE_DIR / ".env")


SECRET_KEY = env("DJANGO_SECRET_KEY")

DEBUG = env.bool(
    "DEBUG",
    default=False,
)

ALLOWED_HOSTS = env.list(
    "ALLOWED_HOSTS",
    default=[
        "localhost",
        "127.0.0.1",
    ],
)


ANAMNESIS_ACCESS_MINUTES = env.int(
    "ANAMNESIS_ACCESS_MINUTES",
    default=120,
)

FRONTEND_URL = env(
    "FRONTEND_URL",
    default="http://localhost:5173",
).rstrip("/")


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "rest_framework",
    "corsheaders",
    "axes",

    "customers",
    "payments",
    "anamnesis",
    "documents",
    "notifications",
    "dashboard",
]


MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "axes.middleware.AxesMiddleware",
]


AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "django.contrib.auth.backends.ModelBackend",
]


ROOT_URLCONF = "config.urls"


TEMPLATES = [
    {
        "BACKEND": (
            "django.template.backends.django."
            "DjangoTemplates"
        ),
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                (
                    "django.template.context_processors."
                    "request"
                ),
                (
                    "django.contrib.auth."
                    "context_processors.auth"
                ),
                (
                    "django.contrib.messages."
                    "context_processors.messages"
                ),
            ],
        },
    },
]


WSGI_APPLICATION = "config.wsgi.application"


CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS",
    default=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
)

CORS_ALLOW_CREDENTIALS = True


CSRF_TRUSTED_ORIGINS = env.list(
    "CSRF_TRUSTED_ORIGINS",
    default=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
)


IS_PRODUCTION = not DEBUG


SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = IS_PRODUCTION
SESSION_COOKIE_SAMESITE = (
    "None"
    if IS_PRODUCTION
    else "Lax"
)
SESSION_COOKIE_AGE = 60 * 60
SESSION_SAVE_EVERY_REQUEST = True


CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SECURE = IS_PRODUCTION
CSRF_COOKIE_SAMESITE = (
    "None"
    if IS_PRODUCTION
    else "Lax"
)


SECURE_PROXY_SSL_HEADER = (
    "HTTP_X_FORWARDED_PROTO",
    "https",
)

SECURE_SSL_REDIRECT = env.bool(
    "SECURE_SSL_REDIRECT",
    default=False,
)

SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"


SECURE_HSTS_SECONDS = env.int(
    "SECURE_HSTS_SECONDS",
    default=0,
)

SECURE_HSTS_INCLUDE_SUBDOMAINS = (
    SECURE_HSTS_SECONDS > 0
)

SECURE_HSTS_PRELOAD = False


REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
}


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": env(
            "DB_NAME",
            default="elisangela",
        ),
        "USER": env(
            "DB_USER",
            default="elisangela_app",
        ),
        "PASSWORD": env("DB_PASSWORD"),
        "HOST": env(
            "DB_HOST",
            default="127.0.0.1",
        ),
        "PORT": env(
            "DB_PORT",
            default="3308",
        ),
        "OPTIONS": {
            "charset": "utf8mb4",
        },
    }
}


ASAAS_API_KEY = os.environ[
    "ASAAS_API_KEY"
].strip()

ASAAS_API_URL = env(
    "ASAAS_API_URL",
    default=(
        "https://api-sandbox.asaas.com/v3"
    ),
)

ASAAS_WEBHOOK_TOKEN = env(
    "ASAAS_WEBHOOK_TOKEN"
)

SESSION_PRICE = Decimal(
    env(
        "SESSION_PRICE",
        default="150.00",
    )
)


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "MinimumLengthValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "CommonPasswordValidator"
        ),
    },
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "NumericPasswordValidator"
        ),
    },
]


LANGUAGE_CODE = "pt-br"

TIME_ZONE = "America/Manaus"

USE_I18N = True

USE_TZ = True


STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


STORAGES = {
    "default": {
        "BACKEND": (
            "django.core.files.storage."
            "FileSystemStorage"
        ),
    },
    "staticfiles": {
        "BACKEND": (
            "whitenoise.storage."
            "CompressedManifestStaticFilesStorage"
        ),
    },
}


DEFAULT_AUTO_FIELD = (
    "django.db.models.BigAutoField"
)


EMAIL_BACKEND = (
    "django.core.mail.backends.smtp."
    "EmailBackend"
)

EMAIL_HOST = env(
    "EMAIL_HOST",
    default="smtp.gmail.com",
)

EMAIL_PORT = env.int(
    "EMAIL_PORT",
    default=587,
)

EMAIL_HOST_USER = env(
    "EMAIL_HOST_USER"
)

EMAIL_HOST_PASSWORD = env(
    "EMAIL_HOST_PASSWORD"
)

EMAIL_USE_TLS = env.bool(
    "EMAIL_USE_TLS",
    default=True,
)

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

THERAPIST_EMAIL = env(
    "THERAPIST_EMAIL",
    default=EMAIL_HOST_USER,
)

EMAIL_TIMEOUT = 20


AXES_LOCKOUT_CALLABLE = (
    "dashboard.security."
    "axes_lockout_response"
)