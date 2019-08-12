from django.urls import path, include
from tds.urls import url_patterns

urlpatterns = [
    path('', include(url_patterns)),
]
