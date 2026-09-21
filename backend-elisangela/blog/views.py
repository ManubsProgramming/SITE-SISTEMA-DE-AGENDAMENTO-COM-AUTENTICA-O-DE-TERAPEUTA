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