from rest_framework import serializers

from .models import BlogPost


class PublicBlogPostSerializer(
    serializers.ModelSerializer
):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "category",
            "cover_image_url",
            "author_name",
            "published_at",
            "created_at",
        )

    def get_author_name(self, obj):
        return (
            obj.author.get_full_name()
            or obj.author.username
        )


class DashboardBlogPostSerializer(
    serializers.ModelSerializer
):
    class Meta:
        model = BlogPost
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "category",
            "cover_image_url",
            "status",
            "published_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "slug",
            "published_at",
            "created_at",
            "updated_at",
        )

    def validate_title(self, value):
        value = " ".join(value.split())

        if len(value) < 5:
            raise serializers.ValidationError(
                "Informe um título maior."
            )

        return value

    def validate_excerpt(self, value):
        value = value.strip()

        if len(value) < 10:
            raise serializers.ValidationError(
                "Informe um resumo maior."
            )

        return value

    def validate_content(self, value):
        value = value.strip()

        if len(value) < 20:
            raise serializers.ValidationError(
                "Informe um conteúdo maior."
            )

        return value

    def create(self, validated_data):
        return BlogPost.objects.create(
            author=self.context["request"].user,
            **validated_data,
        )