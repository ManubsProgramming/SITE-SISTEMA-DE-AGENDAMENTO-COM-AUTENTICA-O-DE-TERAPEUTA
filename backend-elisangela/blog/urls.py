from django.urls import path

from .views import (
    dashboard_post_detail,
    dashboard_posts,
    public_post_detail,
    public_posts,
)


urlpatterns = [
    path(
        "posts/",
        public_posts,
        name="public-blog-posts",
    ),
    path(
        "posts/<slug:slug>/",
        public_post_detail,
        name="public-blog-post-detail",
    ),
    path(
        "dashboard/posts/",
        dashboard_posts,
        name="dashboard-blog-posts",
    ),
    path(
        "dashboard/posts/<int:post_id>/",
        dashboard_post_detail,
        name="dashboard-blog-post-detail",
    ),
]