from django.urls import path, include
from .views import index_view, landing_page

api_patterns = []

url_patterns = [
    path('management/', index_view),
    # set real regex pattern
    # path('<str:str>', landing_page),
    # path('api/', include(api_patterns)),
]
