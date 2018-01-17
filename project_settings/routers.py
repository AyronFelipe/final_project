from rest_framework.routers import DefaultRouter
from accounts import viewsets as accounts_viewsets


router = DefaultRouter()
router.register(r'users', accounts_viewsets.UserViewSet)
router.register(r'persons', accounts_viewsets.PersonViewSet)
router.register(r'institutions', accounts_viewsets.InstitutionViewSet)