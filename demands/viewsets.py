from rest_framework import generics, viewsets, permissions
from .models import *
from core.models import Tag
from .serializers import DemandSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


class DemandViewSet(viewsets.ViewSet):

    def list(self, request):

        queryset = Demand.objects.all()
        serializer = DemandSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):

        demand = Demand.objects.get(pk=pk)
        serializer = DemandSerializer(demand)
        return Response(serializer.data)

    def create(self, request):

        data = {}
        name = request.POST.get('name')
        quantity = request.POST.get('quantity')
        unit_measurement = request.POST.get('unit_measurement')
        description = request.POST.get('description')
        main_photo = request.POST.get('main_photo')
        if name == '' or quantity == '' or unit_measurement == None:
            if name == '':
                data['message_error_name'] = 'Este campo não pode estar em branco'
            if quantity == '':
                data['message_error_quantity'] = 'Este campo não pode estar em branco'
            if unit_measurement == None:
                data['message_error_unit_measurement'] = 'Este campo não pode estar em branco'
            return Response(data, status=status.HTTP_401_UNAUTHORIZED,)
        else:
            serializer = DemandSerializer(data=request.data)
            if serializer.is_valid():
                demand = Demand()
                with transaction.atomic():
                    demand.name = name
                    demand.quantity = quantity
                    demand.unit_measurement = UnitMeasurement.objects.get(pk=int(unit_measurement))
                    demand.description = description
                    demand.main_photo = request.FILES.get('main_photo')
                    demand.owner = request.user
                    demand.phone = request.user.phone
                    demand.cell_phone = request.user.cell_phone
                    if request.POST.get('aparecer') == True:
                        demand.neighborhood = request.POST.get('neighborhood')
                        demand.street = request.POST.get('street')
                        demand.number = request.POST.get('number')
                        demand.cep = request.POST.get('cep')
                        demand.uf = request.POST.get('uf')
                        demand.city = request.POST.get('city')
                        demand.complement = request.POST.get('complement')
                    else:
                        demand.neighborhood = request.user.neighborhood
                        demand.street = request.user.street
                        demand.number = request.user.number
                        demand.cep = request.user.cep
                        demand.uf = request.user.uf
                        demand.city = request.user.city
                        demand.complement = request.user.complement
                    demand.save()
                    for tag in request.POST.getlist('tags'):
                        current_tag, created = Tag.objects.get_or_create(name=tag)
                        DemandTags.objects.create(demand=demand, tag=current_tag)
                    return Response(serializer.data, status=status.HTTP_201_CREATED,)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)