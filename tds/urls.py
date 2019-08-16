from django.urls import path, include
from .views import (
    DisplayLinks,
    ManiupulateLink,
    get_short_url,
    GetUserStats,
    get_countries,
    LinkStatsView)

link_patterns = [
    path('', DisplayLinks.as_view()),
    path('get-url/', get_short_url),
    path('<str:pk>/', ManiupulateLink.as_view()),
    path('<str:pk>/stats/', LinkStatsView.as_view()),
]
api_patterns = [
    path('links/', include(link_patterns)),
    path('ip/<str:ip>', GetUserStats.as_view()),
    path('get-countries/', get_countries),
]
