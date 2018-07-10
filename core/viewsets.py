from rest_framework import viewsets, permissions
from .models import Tag
from .serializers import TagSerializer


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem de Tags
    '''
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tag.objects.all()
    serializer_class = TagSerializer