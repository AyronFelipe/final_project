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
from core.utils import send_push_notification
from datetime import datetime
from rest_framework.decorators import api_view

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
            donation = Donation()
            with transaction.atomic():
                donation.name = request.POST.get('name')
                donation.description = request.POST.get('description')
                donation.validity = request.POST.get('validity')
                donation.validity_hour = request.POST.get('validity_hour')
                if 'aparecer' in request.POST and request.POST.get('aparecer') == True:
                    donation.neighborhood = request.POST.get('neighborhood')
                    donation.street = request.POST.get('street')
                    donation.number = request.POST.get('number')
                    if request.POST.get("cep") == '':
                        data = []
                        data['cep'] = 'O preenchimento do CEP é obrigatório.'
                        return Response(data, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        donation.cep = request.POST.get("cep")
                    donation.uf = request.POST.get("uf")
                    donation.city = request.POST.get("city")
                    donation.complement = request.POST.get("complement")
                else:
                    donation.neighborhood = request.user.neighborhood
                    donation.street = request.user.street
                    donation.number = request.user.number
                    donation.cep = request.user.cep
                    donation.uf= request.user.uf
                    donation.city = request.user.city
                    donation.complement = request.user.complement
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
    Listagem das Doações
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
        list_donations = []
        queryset = Donation.objects.filter(donator=request.user)
        for obj in queryset:
            obj.update_status()
            list_donations.append(obj)
        serializer = DonationSerializer(list_donations, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Donation.objects.filter(sender=request.user)
        donation = get_object_or_404(queryset, pk=pk)
        donation_updated  = donation.update_status()
        serializer = DonationSerializer(donation_updated)
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        data = {}
        if request.user.is_authenticated:
            donation = Donation.objects.filter(pk=pk)
            if donation:
                donation.last().delete()
                list_donations = []
                queryset = Donation.objects.filter(donator=request.user)
                for obj in queryset:
                    obj.update_status()
                    list_donations.append(obj)
                serializer = DonationSerializer(list_donations, many=True)
                data['message'] = 'Doação deletada com sucesso!'
                data['donations'] = serializer.data
                return Response(data, status=status.HTTP_200_OK)
            data['message'] = 'Doação não encontrada!'
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        data['message'] = 'Usuário não autenticado!'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)


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
                data = {}
                solicitation.owner = request.user
                solicitation.donation = Donation.objects.get(id=request.POST.get('donation'))
                if request.POST.get('comment') == '':
                    solicitation.comment = 'Nenhum comentário'
                else:
                    solicitation.comment = request.POST.get('comment')
                if solicitation.donation.status != Donation.ACTIVE:
                    data['message'] = 'Esta doação não pode ser solicitada.'
                    return Response(data, status=status.HTTP_403_FORBIDDEN)
                solicitation.save()

                donation = Donation.objects.get(id=request.POST.get('donation'))
                message = 'A sua doação ' + donation.slug + ' foi solicitada pelo usuário ' + solicitation.owner.get_name() + '.'
                notification = Notification.objects.create(message=message, notified=donation.donator, sender=solicitation.owner, type=Notification.MY_DONATIONS)
                send_push_notification(notification)

                subject = "Sua doação foi solicitada"
                context = {}
                context['user'] = donation.donator
                context['domain'] = get_current_site(request).domain
                context['protocol'] = 'https' if request.is_secure() else 'http'
                context['donation'] = donation
                context['solicitation'] = solicitation
                send_mail_template(subject, "emails/notification_solicitation_email.html", context, [donation.donator.email])
                data['message'] = 'Solicitação feita com sucesso!'
                return Response(data, status=status.HTTP_201_CREATED,)
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
        if request.user.is_authenticated:
            queryset = Solicitation.objects.filter(owner=request.user)
            for obj in queryset:
                obj.update_status()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            return Response(serializer.data)
        data = {}
        data['message'] = 'Usuário não autenticado'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED,)

    def retrieve(self, request, pk=None):
        if request.user.is_authenticated:
            queryset = Solicitation.objects.filter(owner=request.user)
            solicitation = get_object_or_404(queryset, pk=pk)
            serializer = SolicitationSerializer(solicitation)
            return Response(serializer.data)
        data = {}
        data['message'] = 'Usuário não autenticado'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED,)

    def destroy(self, request, pk=None):

        data = {}
        with transaction.atomic():
            if request.user.is_authenticated:
                solicitation = Solicitation.objects.filter(id=pk)
                if solicitation:
                    if solicitation.last().owner != request.user:
                        data['message'] = 'Tentando apagar as solicitações dos outros, né!'
                        return Response(data, status=status.HTTP_400_BAD_REQUEST,)
                    solicitation.last().delete()
                    queryset = Solicitation.objects.filter(owner=request.user)
                    list_solicitations = []
                    for obj in queryset:
                        obj.update_status()
                        list_solicitations.append(obj)
                    serializer = SolicitationSerializer(list_solicitations, many=True)
                    data['message'] = 'Solicitação deletada com sucesso!'
                    data['solicitations'] = serializer.data
                    return Response(data, status=status.HTTP_200_OK,)
                data['message'] = 'Solicitação não encontrada'
                return Response(data, status=status.HTTP_400_BAD_REQUEST,)
            data['message'] = 'Usuário não autenticado'
            return Response(data, status=status.HTTP_401_UNAUTHORIZED,)


class SolicitationsOfDonationViewSet(viewsets.ViewSet):
    '''
    Criando um endpoint no qual se passa o ID de uma doação e todas as solicitações da supra dita doação são retornadas.
    Fazendo isso porque o serializers não funcionam. ¬¬
    '''

    def list(self, request, id=None):
        data = {}
        if request.user.is_authenticated:
            list_solicitations = []
            queryset = Solicitation.objects.filter(donation__id=id)
            for obj in queryset:
                obj.update_status()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            data['solicitations'] = serializer.data
            return Response(data, status=status.HTTP_200_OK)
        data['message'] = 'Usuário não autenticado'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED,)


class AcceptSolicitation(APIView):
    '''
    Criando endpoint no qual a solicitação é aceita
    '''
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):

        data = {}
        solicitation_pk = request.POST.get('solicitation')
        validity = request.POST.get('validity')
        validity_hour = request.POST.get('validity_hour')
        with transaction.atomic():
            if validity == '' or validity_hour == '' or solicitation_pk == '':
                data['message'] = "Nenhum dos campos podem ficar em branco."
                return Response(data, status=status.HTTP_401_UNAUTHORIZED,)

            try:
                solicitation = Solicitation.objects.get(pk=solicitation_pk)
            except:
                data['message'] = 'Solicitação não encontrada.'
                return Response(data, status=status.HTTP_404_NOT_FOUND)

            #Doação
            donation = Donation.objects.get(pk=solicitation.donation.pk)

            # Verificação se a validade da doação é maior ou menor que a validade da solicitação
            combined_time_donation = datetime.combine(donation.validity, donation.validity_hour)
            combined_time_solicitation = datetime.combine(datetime.strptime(validity, '%Y-%m-%d'), datetime.strptime(validity_hour, '%H:%M').time())
            if combined_time_solicitation > combined_time_donation:
                data['message'] = "A validade da solicitação tem que ser menor ou igual ao validade da doação."
                return Response(data, status=status.HTTP_401_UNAUTHORIZED,)

            #Doação fica com status de espera
            donation.status = Donation.ON_HOLD
            donation.save()

            # Solicitação fica com status de aceita
            solicitation.is_accepted = True
            solicitation.status = Solicitation.ACCEPTED
            solicitation.validity = validity
            solicitation.validity_hour = validity_hour
            solicitation.save()

            # As outras solicitações da doação ficam em espera
            for obj in donation.solicitations.all():
                if obj.pk != solicitation.pk and obj.status != Solicitation.REJECTED and obj.status != Solicitation.UNCOMPLETED:
                    obj.status = Solicitation.ON_HOLD
                    obj.save()

            # Notificação
            message = 'A sua solicitação ' + solicitation.slug + ' foi aceita pelo usuário ' + donation.donator.get_name() + '.'
            notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
            send_push_notification(notification)

            #Email
            subject = "Sua solicitação foi aceita"
            context = {}
            context['user'] = solicitation.owner
            context['domain'] = get_current_site(request).domain
            context['protocol'] = 'https' if request.is_secure() else 'http'
            context['donation'] = donation
            context['solicitation'] = solicitation
            send_mail_template(subject, "emails/notification_accept_solicitation_email.html", context, [solicitation.owner.email])

            #Feedback usuário
            list_solicitations = []
            queryset = Solicitation.objects.filter(donation__id=donation.pk)
            for obj in queryset:
                obj.update_status()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            data['solicitations'] = serializer.data
            data['message'] = 'Solicitação aceita com sucesso!'
            return Response(data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RejectSolicitation(APIView):
    '''
    Endpoint no qual a solicitação é rejeitada
    '''
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = {}
        with transaction.atomic():
            solicitation_pk = request.POST.get('solicitation', None)
            if not solicitation_pk:
                data['message'] = "Solicitação não encontrada."
                return Response(data, status=status.HTTP_404_NOT_FOUND,)

            reason_rejection = request.POST.get('reason_rejection')
            if reason_rejection == '':
                data['message'] = "O motivo de rejeição não pode ficar em branco."
                return Response(data, status=status.HTTP_400_BAD_REQUEST,)

            solicitation = Solicitation.objects.get(pk=solicitation_pk)
            solicitation.status = Solicitation.REJECTED
            solicitation.reason_rejection = reason_rejection
            solicitation.save()

            #Validação da doação
            donation = Donation.objects.get(pk=solicitation.donation.pk)
            if donation.status == Donation.INVALID:
                data['message'] = 'Esta solicitação não pode ser movimentada, a doação está vencida.'
                return Response(data, status=status.HTTP_400_BAD_REQUEST)

            list_solicitations = []
            queryset = Solicitation.objects.filter(donation__id=donation.pk)
            for obj in queryset:
                obj.update_status()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            data['solicitations'] = serializer.data
            data['message'] = 'Solicitação rejeitada com sucesso.'

            #Notificação
            message = 'A sua solicitação ' + solicitation.slug + ' foi rejeitada pelo usuário ' + donation.donator.get_name() + '.'
            notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
            send_push_notification(notification)

            #E-mail
            subject = "Sua solicitação foi rejeitada"
            context = {}
            context['user'] = solicitation.owner
            context['domain'] = get_current_site(request).domain
            context['protocol'] = 'https' if request.is_secure() else 'http'
            context['donation'] = donation
            context['solicitation'] = solicitation
            send_mail_template(subject, "emails/notification_rejection_solicitation_email.html", context, [solicitation.owner.email])

            return Response(data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CancelDonationSolicitation(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = {}
        solicitation_pk = request.POST.get('solicitation')
        try:
            solicitation = Solicitation.objects.get(pk=solicitation_pk)
        except:
            data['message'] = 'Solicitação não encontrada.'
        with transaction.atomic():
            solicitation.status = Solicitation.CREATED
            solicitation.save()

            donation = Donation.objects.get(pk=solicitation.donation.pk)
            for obj in donation.solicitations.all():
                if obj.status != Solicitation.REJECTED:
                    obj.status = Solicitation.CREATED
                    obj.save()

            message = 'A sua solicitação ' + solicitation.slug + ' foi cancelada pelo usuário ' + donation.donator.get_name() + '.'
            notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
            send_push_notification(notification)

            list_solicitations = []
            queryset = Solicitation.objects.filter(donation__id=donation.pk)
            for obj in queryset:
                obj.update_status()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            if donation.status != Donation.INVALID:
                donation.status = Donation.ACTIVE
                donation.save()
            data['solicitations'] = serializer.data
            data['message'] = 'Solicitação rejeitada com sucesso.'

            subject = "Sua solicitação foi rejeitada"
            context = {}
            context['user'] = solicitation.owner
            context['domain'] = get_current_site(request).domain
            context['protocol'] = 'https' if request.is_secure() else 'http'
            context['donation'] = donation
            context['solicitation'] = solicitation
            send_mail_template(subject, "emails/notification_cancelation_solicitation_email.html", context, [solicitation.owner.email])

            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotAppearDonationSolicitation(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = {}
        solicitation_pk = request.POST.get('solicitation')
        try:
            solicitation = Solicitation.objects.get(pk=solicitation_pk)
        except:
            data['message'] = 'Solicitação não encontrada.'
            return Response(data, status=status.HTTP_404_NOT_FOUND)
        with transaction.atomic():
            solicitation.status = Solicitation.UNCOMPLETED
            solicitation.save()

            donation = Donation.objects.get(pk=solicitation.donation.pk)

            message = 'A sua solicitação ' + solicitation.slug + ' da doação ' + donation.slug + ' foi marcada como incompleta, pois você não compareceu no local determinado.'
            notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
            send_push_notification(notification)

            subject = "Sua solicitação está imcompleta"
            context = {}
            context['user'] = solicitation.owner
            context['domain'] = get_current_site(request).domain
            context['protocol'] = 'https' if request.is_secure() else 'http'
            context['donation'] = donation
            context['solicitation'] = solicitation
            send_mail_template(subject, "emails/notification_not_appear_solicitation_email.html", context, [solicitation.owner.email])

            list_solicitations = []
            for obj in donation.solicitations.all():
                if obj.pk != solicitation.pk and obj.status != Solicitation.REJECTED and obj.status != Solicitation.UNCOMPLETED:
                    obj.status = Solicitation.CREATED
                    obj.save()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            if donation.status != Donation.INVALID:
                donation.status = Donation.ACTIVE
                donation.save()
            data['solicitations'] = serializer.data
            data['message'] = 'Solicitação atualizada com sucesso.'
            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FinalizeDonationSolicitation(APIView):

    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = {}
        solicitation_pk = request.POST.get('solicitation')
        try:
            solicitation = Solicitation.objects.get(pk=solicitation_pk)
        except:
            data['message'] = 'Solicitação não encontrada.'
            return 
        with transaction.atomic():
            solicitation.status = Solicitation.COMPLETED
            solicitation.save()
            serializer = SolicitationSerializer(solicitation)
            donation = Donation.objects.get(pk=solicitation.donation.pk)

            donation.status = Donation.COMPLETED
            donation.is_accepted = True
            donation.receiver = solicitation.owner
            donation.save()

            message = 'A sua solicitação ' + solicitation.slug + ' da doação ' + donation.slug + 'foi finalizada. Obrigado por usar o AlimentAÍ.'
            notification = Notification.objects.create(message=message, notified=solicitation.owner, sender=donation.donator, type=Notification.MY_SOLICITATIONS)
            send_push_notification(notification)
            
            subject = "Parabéns - Sua solicitação foi finalizada"
            context = {}
            context['user'] = solicitation.owner
            context['domain'] = get_current_site(request).domain
            context['protocol'] = 'https' if request.is_secure() else 'http'
            context['donation'] = donation
            context['solicitation'] = solicitation
            send_mail_template(subject, "emails/notification_finalize_solicitation_email.html", context, [solicitation.owner.email])

            list_solicitations = []
            for obj in donation.solicitations.all():
                if obj.pk != solicitation.pk:
                    if obj.status != Solicitation.REJECTED:
                        obj.status = Solicitation.UNCOMPLETED
                        obj.save()
                list_solicitations.append(obj)
            serializer = SolicitationSerializer(list_solicitations, many=True)
            data['solicitations'] = serializer.data
            data['message'] = 'Solicitação finalizada com sucesso.'

            return Response(data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def edit_donation(request, pk):

    data = {}
    donation = Donation.objects.get(pk=pk)
    if request.user.is_authenticated:
        if request.user.pk != donation.donator.pk:
            data['message'] = 'Tentando hackear os endpoints, né!'
        else:
            with transaction.atomic():
                if donation.status == Donation.COMPLETED or donation.status == Donation.ON_HOLD:
                    data['message'] = 'A doação não pode ser editada.'
                    return Response(data, status=status.HTTP_403_FORBIDDEN)
                name = request.POST.get('name', None)
                description = request.POST.get('description', None)
                if name:
                    donation.name = name
                if description:
                    donation.description = description
                for tag in request.POST.getlist('tags'):
                    current_tag, created = Tag.objects.get_or_create(name=tag)
                    DonationTags.objects.get_or_create(donation=donation, tag=current_tag)
                validity = request.POST.get('validity', None)
                if validity:
                    donation.validity = validity
                validity_hour = request.POST.get('validity_hour', None)
                if validity_hour:
                    donation.validity_hour = validity_hour
                cep = request.POST.get('cep', None)
                if cep:
                    donation.cep = cep
                street = request.POST.get('street', None)
                if street:
                    donation.street = street
                neighborhood = request.POST.get('neighborhood', None)
                if neighborhood:
                    donation.neighborhood = neighborhood
                city = request.POST.get('city', None)
                if city:
                    donation.city = city
                uf = request.POST.get('uf', None)
                if uf:
                    donation.uf = uf
                number = request.POST.get('number', None)
                if number:
                    donation.number = number
                combined_time_donation = datetime.combine(datetime.strptime(donation.validity, '%Y-%m-%d'), donation.validity_hour)
                if combined_time_donation > datetime.today():
                    donation.status = Donation.ACTIVE
                    data['message'] = 'Informações alteradas com sucesso!'
                    data['detail'] = 'Notamos que você alterou a data de validade, portanto sua doação passa para o status de Ativa novamente e estará disponível para outros usuários solicitarem.'
                else:
                    data['message'] = 'Informações alteradas com sucesso!'
                    data['detail'] = 'Obrigado por usar o Alimentaí'
                donation.save()
                return Response(data, status=status.HTTP_201_CREATED)
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    data['message'] = 'Usuário não autenticado!'
    return Response(data, status=status.HTTP_401_UNAUTHORIZED)

