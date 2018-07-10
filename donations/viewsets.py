from rest_framework import generics, viewsets, permissions
from .models import Donation, Solicitation, DonationTags
from .serializers import DonationSerializer, SolicitationSerializer
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from core.models import Photo, Tag, Notification

User = get_user_model()


class CreateDonationViewSet(generics.CreateAPIView):
    '''
    Criação de doações
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = DonationSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.validated_data
            donation = Donation(
                name = instance.get('name'),
                description = instance.get('description'),
                validity = instance.get('validity'),
                validity_hour = instance.get('validity_hour'),
                main_photo = instance.get('main_photo'),
                neighborhood=instance.get('neighborhood'), 
                street=instance.get('street'), 
                number=instance.get('number'), 
                cep=instance.get("cep"), 
                uf=instance.get("uf"), 
                city=instance.get("city"), 
                complement=instance.get("complement")
            )
            with transaction.atomic():
                donation.donator = request.user
                donation.save()
                for photo in request.FILES.getlist('photos'):
                    Photo.objects.create(image_file=photo, donation=donation)
                for tag in request.POST.getlist('tags'):
                    current_tag, created = Tag.objects.get_or_create(name=tag)
                    DonationTags.objects.create(donation=donation, tag=current_tag)
                return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DonationViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Instituições
    '''
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer


class CreateSolicitationViewSet(generics.CreateAPIView):
    '''
    Criação de uma solicitação
    '''
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Solicitation.objects.all()
    serializer_class = SolicitationSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = SolicitationSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.validated_data
            solicitation = Solicitation(
                validity = instance.get('validity'),
                validity_hour = instance.get('validity_hour'),
                donation = instance.get('donation'),
            )
            with transaction.atomic():
                solicitation.owner = request.user
                solicitation.save()
                donation = instance.get('donation')
                message = 'A sua doação ' + donation.slug + ' foi solicitada pelo usuário ' + solicitation.owner.get_name() + '.'
                Notification.objects.create(message=message, notified=donation.donator)
                return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SolicitationViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Solicitalções
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Solicitation.objects.all()
    serializer_class = SolicitationSerializer
    

