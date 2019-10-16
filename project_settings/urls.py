from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .routers import router
from accounts.viewsets import CreatePersonViewSet, CreateInstitutionViewSet, login, logged_user, forget_password, edit_user, edit_user_address, edit_user_password
from donations.viewsets import CreateDonationViewSet, CreateSolicitationViewSet, SolicitationsOfDonationViewSet, AcceptSolicitation, RejectSolicitation, \
CancelDonationSolicitation, NotAppearDonationSolicitation, FinalizeDonationSolicitation, edit_donation
from rest_framework.authtoken.views import obtain_auth_token
from core.viewsets import get_notifications_empty, get_donations_empty


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('donations/', include('donations.urls', namespace='donations')),
    path('demands/', include('demands.urls', namespace='demands')),
    path('login/', login, name='login'),
    path('forget-password/', forget_password, name='forget_password'),
    path('api/', include(router.urls), name='api'),
    path('api/new-person/', CreatePersonViewSet.as_view(), name='new-person'),
    path('api/new-institution/', CreateInstitutionViewSet.as_view(), name='new_institution'),
    path('api/new-donation/', CreateDonationViewSet.as_view(), name='new_donation'),
    path('api-token-auth/', obtain_auth_token, name='get_auth_token'),
    path('api/logged-user/', logged_user, name='logged_user'),
    path('api/new-solicitation/', CreateSolicitationViewSet.as_view(), name='new_solicitation'),
    path('api/donation/<int:id>/solicitations/', SolicitationsOfDonationViewSet.as_view({'get': 'list'}), name='solicitations_of_donation'),
    path('api/donation/accepts/', AcceptSolicitation.as_view(), name='accept_solicitation'),
    path('api/donation/rejects/', RejectSolicitation.as_view(), name='reject_solicitation'),
    path('api/donation/cancel/', CancelDonationSolicitation.as_view(), name='cancel_solicitation'),
    path('api/donation/not-appear/', NotAppearDonationSolicitation.as_view(), name='not_appear_solicitation'),
    path('api/donation/finalize/', FinalizeDonationSolicitation.as_view(), name='finalize_solicitation'),
    path('api/person/<pk>/edit/', edit_user, name='edit_user'),
    path('api/person/<pk>/address/edit/', edit_user_address, name='edit_user_address'),
    path('api/person/<pk>/password/edit/', edit_user_password, name='edit_user_password'),
    path('api/donation/<pk>/edit/', edit_donation, name='edit_donation'),
    path('api/comments-empty/', get_notifications_empty, name='get_notifications_empty'),
    path('api/donations-empty/', get_donations_empty, name='get_donations_empty'),
]

if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
