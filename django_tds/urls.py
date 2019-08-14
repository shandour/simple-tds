from django.urls import path, include
from django.views.generic.base import TemplateView

from tds.urls import (
    api_patterns as tds_api_patterns,
)
from tds.views import landing_page
from users.urls import urlpatterns as user_api_patterns

api_patterns = user_api_patterns + tds_api_patterns

urlpatterns = [
    path('api/', include(api_patterns)),
    path('management/<path>',
         TemplateView.as_view(template_name='index.html')),
    path('management/',
         TemplateView.as_view(template_name='index.html')),
    path('<path:url>', landing_page),
]
