from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Usuario
from .serializers import UsuarioSerializer
from django.contrib.auth import authenticate

from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework import viewsets

@api_view(['POST'])

#cadastro

def cadastro(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return Response({"error": "Usuário já existe"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
    )

    return Response({
        "message": "Usuário criado com sucesso",
        "username": user.username
    })

# login
@api_view(['POST'])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            "message": "Login realizado com sucesso",
            "id": user.id,
            "username": user.username
        })

    return Response({
        "error": "Usuário ou senha inválidos"
    }, status=401)

