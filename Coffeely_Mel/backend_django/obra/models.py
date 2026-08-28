
from django.db import models
from django.contrib.auth.models import User

class Obra(models.Model):

    titulo = models.CharField(max_length=110)

    autor = models.CharField(max_length=110)

    ano_publicacao = models.IntegerField()

    capa = models.ImageField(
        upload_to='capas/',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.titulo



class Biblioteca(models.Model):

    CATEGORIAS = [
        ("Quero Ler", "Quero Ler"),
        ("Lendo", "Lendo"),
        ("Lidos", "Lidos"),
        ("Em Pausa", "Em Pausa"),
    ]

    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    obra = models.ForeignKey(Obra, on_delete=models.CASCADE)

    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS,
        default="Quero Ler"
    )
