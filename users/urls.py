from django.urls import path

from .views import Registration, GetCurrentUser, Login

urlpatterns = [
    path('register/', Registration.as_view()),
    path('current-user/', GetCurrentUser.as_view()),
    path('login/', Login.as_view()),
]
