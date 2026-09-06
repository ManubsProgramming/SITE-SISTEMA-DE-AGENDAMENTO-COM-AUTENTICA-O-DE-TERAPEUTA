import json
from pathlib import Path

from rest_framework import serializers

from .models import Anamnesis


def load_form_schema():
    path = Path(__file__).with_name("form_schema.json")

    with path.open(encoding="utf-8") as file:
        return json.load(file)


class SubmitAnamnesisSerializer(serializers.Serializer):
    payment_id = serializers.UUIDField()

    access_token = serializers.CharField(
        min_length=32,
        max_length=200,
        write_only=True,
        trim_whitespace=True,
    )

    form_version = serializers.CharField(
        default="1.0",
        max_length=20,
    )

    answers = serializers.JSONField()

    def validate_answers(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError(
                "As respostas devem ser um objeto."
            )

        required_sections = {
            "identification",
            "responses",
            "feelings_map",
            "consent",
        }

        missing_sections = required_sections - set(value)

        if missing_sections:
            raise serializers.ValidationError(
                "Seções ausentes: "
                + ", ".join(sorted(missing_sections))
            )

        self.validate_identification(
            value["identification"]
        )
        self.validate_responses(
            value["responses"]
        )
        self.validate_feelings(
            value["feelings_map"]
        )
        self.validate_consent(
            value["consent"]
        )

        return value

    def validate_identification(self, identification):
        if not isinstance(identification, dict):
            raise serializers.ValidationError(
                {
                    "identification": (
                        "Os dados de identificação são inválidos."
                    )
                }
            )

        schema = load_form_schema()
        known_fields = {
            field["id"]
            for field in schema["identification"]
        }
        received_fields = set(identification)

        unknown_fields = received_fields - known_fields

        if unknown_fields:
            raise serializers.ValidationError(
                {
                    "identification": (
                        "Campos desconhecidos: "
                        + ", ".join(sorted(unknown_fields))
                    )
                }
            )

        required_fields = {
            field["id"]
            for field in schema["identification"]
            if field.get("required")
        }

        empty_fields = [
            field_id
            for field_id in required_fields
            if not str(
                identification.get(field_id, "")
            ).strip()
        ]

        if empty_fields:
            raise serializers.ValidationError(
                {
                    "identification": (
                        "Campos obrigatórios ausentes: "
                        + ", ".join(sorted(empty_fields))
                    )
                }
            )

    def validate_responses(self, responses):
        if not isinstance(responses, dict):
            raise serializers.ValidationError(
                {
                    "responses": (
                        "As respostas das perguntas são inválidas."
                    )
                }
            )

        schema = load_form_schema()
        questions = {
            question["id"]: question
            for question in schema["questions"]
        }

        unknown_questions = set(responses) - set(questions)

        if unknown_questions:
            raise serializers.ValidationError(
                {
                    "responses": (
                        "Perguntas desconhecidas: "
                        + ", ".join(sorted(unknown_questions))
                    )
                }
            )

        required_questions = {
            question_id
            for question_id, question in questions.items()
            if question.get("required")
        }

        unanswered = [
            question_id
            for question_id in required_questions
            if not str(responses.get(question_id, "")).strip()
        ]

        if unanswered:
            raise serializers.ValidationError(
                {
                    "responses": (
                        "Perguntas obrigatórias sem resposta: "
                        + ", ".join(sorted(unanswered))
                    )
                }
            )

    def validate_feelings(self, feelings):
        if not isinstance(feelings, dict):
            raise serializers.ValidationError(
                {
                    "feelings_map": (
                        "O mapa de sentimentos é inválido."
                    )
                }
            )

        schema = load_form_schema()
        known_feelings = {
            feeling["id"]
            for feeling in schema["feelings_map"]["feelings"]
        }

        unknown_feelings = set(feelings) - known_feelings

        if unknown_feelings:
            raise serializers.ValidationError(
                {
                    "feelings_map": (
                        "Sentimentos desconhecidos: "
                        + ", ".join(sorted(unknown_feelings))
                    )
                }
            )

        allowed_intensities = set(
            schema["feelings_map"]["options"]
        )

        invalid_intensities = [
            feeling_id
            for feeling_id, intensity in feelings.items()
            if intensity not in allowed_intensities
        ]

        if invalid_intensities:
            raise serializers.ValidationError(
                {
                    "feelings_map": (
                        "Intensidade inválida em: "
                        + ", ".join(sorted(invalid_intensities))
                    )
                }
            )

    def validate_consent(self, consent):
        if not isinstance(consent, dict):
            raise serializers.ValidationError(
                {"consent": "O consentimento é inválido."}
            )

        if consent.get("privacy_accepted") is not True:
            raise serializers.ValidationError(
                {
                    "consent": (
                        "É necessário aceitar o tratamento "
                        "dos dados da anamnese."
                    )
                }
            )

        if consent.get("truthfulness_accepted") is not True:
            raise serializers.ValidationError(
                {
                    "consent": (
                        "É necessário confirmar a veracidade "
                        "das respostas."
                    )
                }
            )

        if not consent.get("version"):
            raise serializers.ValidationError(
                {
                    "consent": (
                        "A versão do termo é obrigatória."
                    )
                }
            )


class AnamnesisSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="payment.customer.name",
        read_only=True,
    )
    customer_email = serializers.EmailField(
        source="payment.customer.email",
        read_only=True,
    )

    class Meta:
        model = Anamnesis
        fields = (
            "id",
            "payment",
            "customer_name",
            "customer_email",
            "form_version",
            "answers",
            "submitted_at",
        )
        read_only_fields = fields