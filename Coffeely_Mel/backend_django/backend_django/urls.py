from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse
from django.views.static import serve
from pathlib import Path


FRONT_DIR = Path(settings.BASE_DIR).parent / "front"


def inicio(request):
    return FileResponse(open(FRONT_DIR / "inicio.html", "rb"))


urlpatterns = [
    path('', inicio),

    path('admin/', admin.site.urls),

    path('api/', include('usuarios.urls')),
    path('api/', include('obra.urls')),

    re_path(
        r'^front/(?P<path>.*)$',
        serve,
        {'document_root': FRONT_DIR}
    ),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)