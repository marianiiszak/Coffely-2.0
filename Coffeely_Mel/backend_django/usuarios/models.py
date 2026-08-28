
from django.db import models

class Usuario(models.Model):
    name = models.CharField()
    username = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.username
    
from django.db import models

