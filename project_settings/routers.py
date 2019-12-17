from rest_framework.routers import DefaultRouter
from accounts import viewsets as accounts_viewsets
from donations import viewsets as donations_viewsets
from core import viewsets as core_viewsets
from demands import viewsets as demands_viewsets


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
router.register(r'unit-measurements', core_viewsets.UnitMeasurementViewset, base_name='unit_measurement')
router.register(r'comments', core_viewsets.CommentViewset, base_name='comments')
router.register(r'demands', demands_viewsets.DemandViewSet, base_name='demands')
router.register(r'my-demands', demands_viewsets.MyDemandsViewSet, base_name='my_demands')
router.register(r'gifts', demands_viewsets.GiftViewSet, base_name='gifts')
