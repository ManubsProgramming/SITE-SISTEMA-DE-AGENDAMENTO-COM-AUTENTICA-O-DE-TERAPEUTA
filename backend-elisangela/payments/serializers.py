import re

from rest_framework import serializers


class CreatePaymentSerializer(serializers.Serializer):
    name = serializers.CharField(
        min_length=3,
        max_length=150,
    )
    email = serializers.EmailField()
    phone = serializers.CharField(
        min_length=10,
        max_length=20,
    )
    cpf = serializers.CharField(
        min_length=11,
        max_length=14,
        write_only=True,
    )

    def validate_name(self, value):
        return " ".join(value.split())

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        phone = re.sub(r"\D", "", value)

        if len(phone) not in (10, 11, 12, 13):
            raise serializers.ValidationError(
                "Informe um telefone válido."
            )

        return phone

    def validate_cpf(self, value):
        cpf = re.sub(r"\D", "", value)

        if len(cpf) != 11 or cpf == cpf[0] * 11:
            raise serializers.ValidationError(
                "Informe um CPF válido."
            )

        if not self._cpf_digits_are_valid(cpf):
            raise serializers.ValidationError(
                "Informe um CPF válido."
            )

        return cpf

    @staticmethod
    def _cpf_digits_are_valid(cpf):
        for length in (9, 10):
            total = sum(
                int(digit) * weight
                for digit, weight in zip(
                    cpf[:length],
                    range(length + 1, 1, -1),
                )
            )
            check_digit = (total * 10 % 11) % 10

            if check_digit != int(cpf[length]):
                return False

        return True