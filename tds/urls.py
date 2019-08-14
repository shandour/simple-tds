from django.urls import path, include
from .views import DisplayLinks, ManiupulateLink

link_patterns = [
    path('', DisplayLinks.as_view()),
    path('<str:pk>/', ManiupulateLink.as_view()),
]
api_patterns = [
    path('links/', include(link_patterns)),
]
