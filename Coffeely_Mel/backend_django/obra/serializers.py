from rest_framework import serializers
from .models import Obra, Biblioteca


class ObraSerializer(serializers.ModelSerializer):

    class Meta:
        model = Obra
        fields = '__all__'

class BibliotecaSerializer(serializers.ModelSerializer):

    obra = ObraSerializer(read_only=True)

    class Meta:
        model = Biblioteca
        fields = "__all__"