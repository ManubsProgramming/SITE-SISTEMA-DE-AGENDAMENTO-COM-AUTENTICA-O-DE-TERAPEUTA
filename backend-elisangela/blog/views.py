import os

from django.core.files.storage import default_storage
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    AllowAny,
    IsAdminUser,
)
from rest_framework.response import Response

from .models import BlogPost
from .serializers import (
    DashboardBlogPostSerializer,
    PublicBlogPostSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def public_posts(request):
    posts = (
        BlogPost.objects
        .select_related("author")
        .filter(
            status=BlogPost.Status.PUBLISHED
        )
    )

    category = request.GET.get(
        "category",
        "",
    ).strip()

    search = request.GET.get(
        "search",
        "",
    ).strip()

    if category:
        posts = posts.filter(
            category__iexact=category
        )

    if search:
        posts = posts.filter(
            Q(title__icontains=search)
            | Q(excerpt__icontains=search)
            | Q(content__icontains=search)
        )

    serializer = PublicBlogPostSerializer(
        posts,
        many=True,
    )

    return Response({
        "posts": serializer.data,
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def public_post_detail(request, slug):
    post = get_object_or_404(
        BlogPost.objects.select_related(
            "author"
        ),
        slug=slug,
        status=BlogPost.Status.PUBLISHED,
    )

    serializer = PublicBlogPostSerializer(
        post
    )

    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAdminUser])
def dashboard_posts(request):
    if request.method == "GET":
        posts = BlogPost.objects.all()

        search = request.GET.get(
            "search",
            "",
        ).strip()

        if search:
            posts = posts.filter(
                Q(title__icontains=search)
                | Q(
                    category__icontains=search
                )
            )

        serializer = (
            DashboardBlogPostSerializer(
                posts,
                many=True,
            )
        )

        return Response({
            "posts": serializer.data,
        })

    serializer = DashboardBlogPostSerializer(
        data=request.data,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    post = serializer.save()

    return Response(
        DashboardBlogPostSerializer(
            post
        ).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAdminUser])
def dashboard_post_detail(request, post_id):
    post = get_object_or_404(
        BlogPost,
        id=post_id,
    )

    if request.method == "GET":
        return Response(
            DashboardBlogPostSerializer(
                post
            ).data
        )

    if request.method == "DELETE":
        post.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    serializer = DashboardBlogPostSerializer(
        post,
        data=request.data,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    updated_post = serializer.save()

    return Response(
        DashboardBlogPostSerializer(
            updated_post
        ).data
    )
@api_view(["POST"])
@permission_classes([IsAdminUser])
def upload_blog_image(request):
    image = request.FILES.get("image")

    if not image:
        return Response(
            {"detail": "Nenhuma imagem foi enviada."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if image.content_type not in allowed_types:
        return Response(
            {
                "detail":
                "Formato inválido. Use JPG, PNG ou WEBP."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    max_size = 5 * 1024 * 1024

    if image.size > max_size:
        return Response(
            {
                "detail":
                "A imagem deve ter no máximo 5 MB."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    extension = os.path.splitext(image.name)[1].lower()

    filename = (
        f"blog/capas/"
        f"{os.urandom(16).hex()}{extension}"
    )

    saved_path = default_storage.save(
        filename,
        image,
    )

    url = default_storage.url(saved_path)

    if not url.startswith("http"):
        url = request.build_absolute_uri(url)

    return Response(
        {"url": url},
        status=status.HTTP_201_CREATED,
    )