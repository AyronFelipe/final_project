from rest_framework import viewsets, permissions
from .models import Tag, Notification, UnitMeasurement
from .serializers import TagSerializer, NotificationSerializer, UnitMeasurementSerializer
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
    Listagem, recuperação e atualização de Notificações
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
        
        notification = Notification.objects.get(pk=pk)
        notification.unread = False
        notification.save()
        serializer = NotificationSerializer(notification)
        return Response(serializer.data)


class UnitMeasurementViewset(viewsets.ViewSet):
    '''
    Listagem, recuperação e atualização das Unidades de Medida
    '''

    def list(self, request):

        queryset = UnitMeasurement.objects.all()
        serializer = UnitMeasurementSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):

        unit_measurement = UnitMeasurement.objects.get(pk=pk)
        serializer = UnitMeasurementSerializer(unit_measurement)
        return Response(serializer.data)

