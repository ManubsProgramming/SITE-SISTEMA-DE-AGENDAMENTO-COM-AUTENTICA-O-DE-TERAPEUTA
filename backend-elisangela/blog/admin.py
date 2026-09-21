from django.contrib import admin

from .models import BlogPost


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "status",
        "published_at",
        "updated_at",
    )
    list_filter = (
        "status",
        "category",
    )
    search_fields = (
        "title",
        "excerpt",
        "content",
    )
    readonly_fields = (
        "slug",
        "published_at",
        "created_at",
        "updated_at",
    )