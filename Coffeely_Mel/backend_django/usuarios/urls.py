from django.urls import path
from .views import cadastro
from .views import login_view

urlpatterns = [
    path('cadastro/', cadastro),
    path("login/", login_view),
]
