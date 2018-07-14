from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .routers import router
from accounts.viewsets import CreatePersonViewSet, CreateInstitutionViewSet, login, logged_user
from donations.viewsets import CreateDonationViewSet, CreateSolicitationViewSet, DestroySolicitationViewSet
from rest_framework.authtoken.views import obtain_auth_token


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('donations/', include('donations.urls', namespace='donations')),
    path('login/', login, name='login'),
    path('api/', include(router.urls), name='api'),
    path('api/new-person/', CreatePersonViewSet.as_view(), name='new-person'),
    path('api/new-institution/', CreateInstitutionViewSet.as_view(), name='new_institution'),
    path('api/new-donation/', CreateDonationViewSet.as_view(), name='new_donation'),
    path('api-token-auth/', obtain_auth_token, name='get_auth_token'),
    path('api/logged-user/', logged_user, name='logged_user'),
    path('api/new-solicitation/', CreateSolicitationViewSet.as_view(), name='new_solicitation'),
    path('api/delete/solicitation/', DestroySolicitationViewSet.as_view(), name='destroy_solicitation'),
]

if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
