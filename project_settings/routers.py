from rest_framework.routers import DefaultRouter
from accounts import viewsets as accounts_viewsets


router = DefaultRouter()
router.register(r'users', accounts_viewsets.UserViewSet)