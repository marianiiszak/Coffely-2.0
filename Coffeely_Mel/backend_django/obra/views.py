from django.shortcuts import render
from rest_framework import viewsets
from .models import Obra, Biblioteca
from .serializers import ObraSerializer, BibliotecaSerializer


class ObraViewSet(viewsets.ModelViewSet):

    queryset = Obra.objects.all()

    serializer_class = ObraSerializer

class BibliotecaViewSet(viewsets.ModelViewSet):

    queryset = Biblioteca.objects.all()
    serializer_class = BibliotecaSerializer

    def get_queryset(self):

        usuario = self.request.query_params.get("usuario")

        if usuario:
            return Biblioteca.objects.filter(usuario_id=usuario)

        return Biblioteca.objects.all()