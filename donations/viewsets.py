from rest_framework import generics, viewsets, permissions
from .models import Donation, Solicitation, DonationTags
from .serializers import DonationSerializer, SolicitationSerializer
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model
from core.models import Photo, Tag, Notification
from rest_framework.views import APIView
from core.utils import send_mail_template
from django.shortcuts import get_object_or_404
from django.contrib.sites.shortcuts import get_current_site


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
                complement=instance.get("complement"),
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


class DonationViewSet(viewsets.ViewSet):
    '''
    Listagem das Instituições
    '''

    def list(self, request):
        list_donations = []
        tag_id = self.request.query_params.get('tag_id')
        if tag_id:
            tag = Tag.objects.get(id=tag_id)
            queryset = Donation.objects.filter(donation_tags__tag=tag)
        else:  
            queryset = Donation.objects.all()
        for obj in queryset:
            obj.update_status()
            if obj.status == Donation.ACTIVE:
                list_donations.append(obj)
        serializer = DonationSerializer(list_donations, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Donation.objects.all()
        donation = get_object_or_404(queryset, pk=pk)
        serializer = DonationSerializer(donation)
        return Response(serializer.data)


class MyDonationsViewSet(viewsets.ViewSet):
    '''
    Listagem das Minhas Doações
    '''

    def list(self, request):
        queryset = Donation.objects.filter(donator=request.user)
        serializer = DonationSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Donation.objects.filter(sender=request.user)
        donation = get_object_or_404(queryset, pk=pk)
        serializer = DonationSerializer(donation)
        return Response(serializer.data)


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
            solicitation = Solicitation()
            with transaction.atomic():
                solicitation.owner = request.user
                solicitation.donation = Donation.objects.get(id=request.POST.get('donation'))
                solicitation.save()
                donation = Donation.objects.get(id=request.POST.get('donation'))
                message = 'A sua doação ' + donation.slug + ' foi solicitada pelo usuário ' + solicitation.owner.get_name() + '.'
                Notification.objects.create(message=message, notified=donation.donator, sender=solicitation.owner, type=Notification.MY_DONATIONS)
                subject = "Sua doação foi solicitada"
                context = {}
                context['user'] = donation.donator
                context['domain'] = get_current_site(request).domain
                context['protocol'] = 'https' if request.is_secure() else 'http'
                context['donation'] = donation
                context['solicitation'] = solicitation
                send_mail_template(subject, "emails/notification_solicitation_email.html", context, [donation.donator.email])
                return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SolicitationViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Solicitalções
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Solicitation.objects.all()
    serializer_class = SolicitationSerializer


class MySolicitationsViewSet(viewsets.ViewSet):
    '''
    Listagem das Minhas Solicitações
    '''

    def list(self, request):
        list_solicitations = []
        queryset = Solicitation.objects.filter(owner=request.user)
        for obj in queryset:
            if obj.validity != None and obj.validity_hour != None:    
                obj.update_status()
            list_solicitations.append(obj)
        serializer = SolicitationSerializer(list_solicitations, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Solicitation.objects.filter(owner=request.user)
        solicitation = get_object_or_404(queryset, pk=pk)
        serializer = SolicitationSerializer(solicitation)
        return Response(serializer.data)


class DestroySolicitationViewSet(APIView):
    '''
    Extinção de uma solicitação
    '''
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        solicitation = Solicitation.objects.get(id=request.POST.get('id'))
        if solicitation:
            solicitation.delete()
            data = {}
            data['is_valid'] = True
            return Response(data, status=status.HTTP_200_OK,)
        return Response(status=status.HTTP_400_BAD_REQUEST,)


class SolicitationsOfDonationViewSet(viewsets.ViewSet):
    '''
    Criando uma URL na qual se passa o ID de uma doaçõa e retorna todas as solicitações da supra dita doação.
    Fazendo isso porque o serializers não funciona. ¬¬
    '''

    def list(self, request, id=None):
        list_solicitations = []
        queryset = Solicitation.objects.filter(donation__id=id)
        serializer = SolicitationSerializer(queryset, many=True)
        return Response(serializer.data)
