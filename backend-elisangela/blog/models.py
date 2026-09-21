from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class BlogPost(models.Model):
    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Rascunho"
        PUBLISHED = "PUBLISHED", "Publicado"

    title = models.CharField(
        "título",
        max_length=180,
    )
    slug = models.SlugField(
        max_length=200,
        unique=True,
        blank=True,
    )
    excerpt = models.TextField(
        "resumo",
        max_length=500,
    )
    content = models.TextField(
        "conteúdo",
    )
    category = models.CharField(
        "categoria",
        max_length=80,
        blank=True,
    )
    cover_image_url = models.URLField(
        "URL da imagem",
        max_length=1000,
        blank=True,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="blog_posts",
    )
    published_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = [
            "-published_at",
            "-created_at",
        ]
        verbose_name = "publicação"
        verbose_name_plural = "publicações"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = (
                slugify(self.title)
                or "publicacao"
            )
            slug = base_slug
            counter = 2

            while BlogPost.objects.filter(
                slug=slug,
            ).exclude(pk=self.pk).exists():
                slug = (
                    f"{base_slug}-{counter}"
                )
                counter += 1

            self.slug = slug

        if (
            self.status == self.Status.PUBLISHED
            and self.published_at is None
        ):
            self.published_at = timezone.now()

        if self.status == self.Status.DRAFT:
            self.published_at = None

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title