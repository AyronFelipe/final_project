from rest_framework import generics, viewsets, permissions
from .models import Donation
from .serializers import DonationSerializer
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from core.models import Photo

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
                return Response(status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DonationViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Instituições
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    

