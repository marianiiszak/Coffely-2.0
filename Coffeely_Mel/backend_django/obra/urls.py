from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ObraViewSet, BibliotecaViewSet

router = DefaultRouter()
router.register(r'obras', ObraViewSet)
router.register(r"biblioteca", BibliotecaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]