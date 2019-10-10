from rest_framework import viewsets, permissions
from .models import Tag, Notification, UnitMeasurement, Comment
from .serializers import TagSerializer, NotificationSerializer, UnitMeasurementSerializer, CommentSerializer
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.db import transaction


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

        data = {}
        if request.user.is_authenticated:
            try:
                notification = Notification.objects.get(pk=pk)
            except:
                data['message'] = 'Notificação não encontrada!'
                return Response(data, status=status.HTTP_404_NOT_FOUND)
            if notification.unread:
                notification.unread = False
                notification.save()
            return Response(status=status.HTTP_200_OK)
        data['message'] = 'Usuário não autenticado!'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)


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


class CommentViewset(viewsets.ViewSet):

    def list(self, request):

        queryset = Comment.objects.filter(commented=request.user)
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request):

        comment = Comment.objects.get(pk=pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

