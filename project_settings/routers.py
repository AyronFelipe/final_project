from rest_framework.routers import DefaultRouter
from accounts import viewsets as accounts_viewsets
from donations import viewsets as donations_viewsets
from core import viewsets as core_viewsets


router = DefaultRouter()
router.register(r'users', accounts_viewsets.UserViewSet)
router.register(r'persons', accounts_viewsets.PersonViewSet)
router.register(r'institutions', accounts_viewsets.InstitutionViewSet)
router.register(r'donations', donations_viewsets.DonationViewSet, base_name='donation')
router.register(r'solicitations', donations_viewsets.SolicitationViewSet)
router.register(r'tags', core_viewsets.TagViewSet)
router.register(r'notifications', core_viewsets.NotificationViewSet, base_name='notification')
router.register(r'my-solicitations', donations_viewsets.MySolicitationsViewSet, base_name='my_notification')
router.register(r'my-donations', donations_viewsets.MyDonationsViewSet, base_name='my_donation')