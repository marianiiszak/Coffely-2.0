from django.db import models
from django.contrib.auth.models import User
from obra.models import Obra

class Resenha(models.Model):

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    obra = models.ForeignKey(
        Obra,
        on_delete=models.CASCADE
    )

    texto = models.TextField()

    data_da_resenha = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Resenha de {self.usuario}"