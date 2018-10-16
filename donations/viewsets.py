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
from django.db.models import Q
from core.utils import pusher_client

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
                donation.main_photo = request.FILES.get('main_photo')
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
        value_search = self.request.query_params.get('value_search')
        if tag_id:
            if tag_id == '0':
                queryset = Donation.objects.all()
            else:
                tag = Tag.objects.get(id=tag_id)
                queryset = Donation.objects.filter(donation_tags__tag=tag)
        elif value_search:
            queryset = Donation.objects.filter(name__icontains=value_search)
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
        donation_updated  = donation.update_status()
        serializer = DonationSerializer(donation_updated)
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
    
    def destroy(self, request, pk=None):
        donation = Donation.objects.get(pk=pk)
        donation.delete()
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
                notification = Notification.objects.create(message=message, notified=donation.donator, sender=solicitation.owner, type=Notification.MY_DONATIONS)
                pusher_client.trigger('my-channel', 'my-event', {'message': notification.message, 'notified': notification.notified.pk})
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
    Delete de uma solicitação
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
    Criando um endpoint no qual se passa o ID de uma doação e todas as solicitações da supra dita doação são retornadas.
    Fazendo isso porque o serializers não funciona. ¬¬
    '''

    def list(self, request, id=None):
        list_solicitations = []
        queryset = Solicitation.objects.filter(donation__id=id).exclude(status=Solicitation.REJECTED)
        serializer = SolicitationSerializer(queryset, many=True)
        return Response(serializer.data)


class AcceptSolicitation(APIView):
    '''
    Criando endpoint no qual a solicitação é aceita
    '''
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request, pk=None):
        #faltam dados
        solicitation = Solicitation.objects.get(pk=pk)
        solicitation.is_accepted = True
        solicitation.status = Solicitation.ACCEPTED
        solicitation.save()
        donation = Donation.objects.get(pk=solicitation.donation.pk)
        for obj in donation.solicitations.all():
            if obj.pk != solicitation.pk:
                obj.status = Solicitation.ON_HOLD
                obj.save()
        message = 'A sua solicitação ' + solicitation.slug + ' foi aceita pelo usuário ' + donation.donator.get_name() + '.'
        notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
        pusher_client.trigger('my-channel', 'my-event', {'message': notification.message, 'notified': notification.notified.pk})
        #email
        return Response(status=status.HTTP_200_OK)


class RejectSolicitation(APIView):
    '''
    Endpoint no qual a solicitação é rejeitada
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk=None):
        #faltam dados
        solicitation = Solicitation.objects.get(pk=pk)
        solicitation.is_accepted = True
        solicitation.status = Solicitation.REJECTED
        solicitation.save()
        donation = Donation.objects.get(pk=solicitation.donation.pk)
        message = 'A sua solicitação ' + solicitation.slug + ' foi rejeitada pelo usuário ' + donation.donator.get_name() + '.'
        notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
        pusher_client.trigger('my-channel', 'my-event', {'message': notification.message, 'notified': notification.notified.pk})
        #email
        return Response(status=status.HTTP_200_OK)