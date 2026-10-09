from django.urls import path
from .views import cadastro, login_view

urlpatterns = [
    path('cadastro/', cadastro),
    path("entrar/", login_view),
]
