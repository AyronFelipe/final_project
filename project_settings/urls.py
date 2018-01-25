from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .routers import router
from accounts.viewsets import CreatePersonViewSet, CreateInstitutionViewSet, login
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('', include('core.urls'), name='core'),
    path('accounts/', include('accounts.urls'), name='accounts'),
    path('login/', login, name='login'),
    path('api/', include(router.urls), name='api'),
    path('api/new-person/', CreatePersonViewSet.as_view(), name='new-person'),
    path('api/new-institution/', CreateInstitutionViewSet.as_view(), name='new-institution'),
    path('api-token-auth/', obtain_auth_token, name='get_auth_token'),
]

if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
