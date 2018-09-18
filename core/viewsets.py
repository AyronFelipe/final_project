from rest_framework import viewsets, permissions
from .models import Tag, Notification
from .serializers import TagSerializer, NotificationSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem de Tags
    '''
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def get_queryset(self):

        queryset = Tag.objects.all()
        term = self.request.query_params.get('term', None)
        if term is not None:
            queryset = queryset.filter(name__icontains=term)
        return queryset


class NotificationViewSet(viewsets.ViewSet):
    '''
    Listagem de Notificações
    '''
   
    def list(self, request):
        queryset = Notification.objects.filter(notified=request.user)
        serializer = NotificationSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Notification.objects.filter(notified=request.user)
        notification = get_object_or_404(queryset, pk=pk)
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)

    def update(self, request, pk=None):
        pass