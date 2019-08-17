from django.urls import path, include, re_path
from django.views.generic.base import TemplateView, RedirectView

from tds.urls import (
    api_patterns as tds_api_patterns,
)
from tds.views import landing_page
from users.urls import urlpatterns as user_api_patterns

api_patterns = user_api_patterns + tds_api_patterns

urlpatterns = [
    path('api/', include(api_patterns)),
    path('', RedirectView.as_view(pattern_name='index_view')),
    re_path('management.*',
            TemplateView.as_view(template_name='index.html'),
            name='index_view'),
    re_path(r'^(?P<url>[0-9a-zA-z]+)$', landing_page),
]
