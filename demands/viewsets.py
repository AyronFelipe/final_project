from rest_framework import generics, viewsets, permissions
from .models import *
from .serializers import DemandSerializer
from rest_framework.response import Response


class DemandViewSet(viewsets.ViewSet):

    def list(self, request):

        queryset = Demand.objects.all()
        serializer = DemandSerializer(queryset, many=True)
        return Response(serializer.data)