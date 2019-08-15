from django.urls import path, include
from .views import DisplayLinks, ManiupulateLink, get_short_url, GetUserStats

link_patterns = [
    path('', DisplayLinks.as_view()),
    path('<str:pk>/', ManiupulateLink.as_view()),
    path('get_url', get_short_url)
]
api_patterns = [
    path('links/', include(link_patterns)),
    path('ip/<str:ip>', GetUserStats.as_view()),
]
