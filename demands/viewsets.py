from rest_framework import generics, viewsets, permissions
from .models import *
from core.models import Tag
from .serializers import DemandSerializer, GiftSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction


class DemandViewSet(viewsets.ViewSet):

    def list(self, request):

        queryset = Demand.objects.all()
        for demand in queryset:
            demand.update_status()
        serializer = DemandSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):

        demand = Demand.objects.get(pk=pk)
        demand.update_status()
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


class GiftViewSet(viewsets.ViewSet):

    def list(self, request):

        queryset = Gift.objects.all()
        serializer = GiftSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):

        gift = Gift.objects.get(pk=pk)
        serializer = GiftSerializer(gift)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):

        data = {}

        try:
            demand = Demand.objects.get(pk=request.POST.get('demand'))
        except:
            data['message'] = 'Pedido não encontrado'
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        quantity = request.POST.get('quantity', None)
        unit_measurement_pk = request.POST.get('unit_measurement', None)
        if not quantity or not unit_measurement_pk:
            data['message'] = 'Nenhum dos campos pode ficar em branco'
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        unit_measurement = UnitMeasurement.objects.get(pk=unit_measurement_pk)

        Gift.objects.create(
            demand=demand,
            owner=request.user,
            quantity=quantity,
            unit_measurement=unit_measurement,
        )

        data['message'] = 'Quantidade doada com sucesso!'
        return Response(data, status=status.HTTP_200_OK)


class MyDemandsViewSet(viewsets.ViewSet):
    '''
    Listagem dos Meus Pedidos
    '''

    def list(self, request):
        queryset = Demand.objects.filter(owner=request.user)
        for demand in queryset:
            demand.update_status()
        serializer = DemandSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)