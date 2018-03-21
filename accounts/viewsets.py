from rest_framework import generics, viewsets, permissions
from .models import User, Person, Institution
from .serializers import UserSerializer, PersonSerializer, InstitutionSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.template.loader import render_to_string
from core.tokens import account_activation_token
from django.core.mail import EmailMessage
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.conf import settings


@api_view(["POST"])
def login(request):
    '''
    Login de usuário retorna token de autorização e o status 200
    '''
    data = {}
    email = request.POST.get('email')
    password = request.POST.get('password')
    user = authenticate(request, username=email, password=password)
    if email == '' or password == '':
        data["message"] = "Os campos não podem estar em branco"
    else:
        if user is not None:
            if user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK, headers={'Authorization': 'Token ' + token.key})
            else:
                data["message"] = "O usuário ainda não foi ativo, por favor verifique seu email para poder ativa-lo"
        else:
            data["message"] = "Um dos campos foi preenchido incorretamente" 
    return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem dos usuários
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Pessoas
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class InstitutionViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Instituições
    '''

    permission_classes = (permissions.IsAuthenticated,)
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer


class CreatePersonViewSet(generics.CreateAPIView):
    '''
    Criação de pessoas/usuários
    '''

    permission_classes = (permissions.AllowAny,)
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    def post(self, request):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.validated_data
            person = Person(
                email=instance.get('email'), first_name=instance.get('first_name'), 
                last_name=instance.get('last_name'), cpf=instance.get('cpf'), birthday=instance.get('birthday'), 
                phone=instance.get('phone'), cell_phone=instance.get('cell_phone'), neighborhood=instance.get('neighborhood'), 
                street=instance.get('street'), number=instance.get('number'), cep=instance.get("cep"), 
                uf=instance.get("uf"), city=instance.get("city"), complement=instance.get("complement"))
            person.set_password(instance.get('password'))
            person.save()
            current_site = get_current_site(request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string(
                'emails/activate_email.html',
                {
                    'user': person,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(person.pk)),
                    'token': account_activation_token.make_token(person),
                }
            )
            to_email = instance.get('email')
            email = EmailMessage(mail_subject, message, from_email=settings.DEFAULT_FROM_EMAIL, to=[to_email])
            email.send()
            return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateInstitutionViewSet(generics.CreateAPIView):
    '''
    Criação de instituições/usuários
    '''

    permission_classes = (permissions.AllowAny,)
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

    def post(self, request):
        serializer = InstitutionSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.validated_data
            institution = Institution(
                email=instance.get('email'), name=instance.get('name'), cnpj=instance.get('cnpj'), 
                phone=instance.get('phone'), cell_phone=instance.get('cell_phone'), 
                neighborhood=instance.get('neighborhood'), street=instance.get('street'), 
                number=instance.get('number'))
            institution.set_password(instance.get('password'))
            institution.save()
            current_site = get_current_site(request)
            mail_subject = 'Activate your blog account.'
            message = render_to_string(
                'emails/activate_email.html',
                {
                    'user': institution,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(institution.pk)),
                    'token': account_activation_token.make_token(institution),
                }
            )
            to_email = instance.get('email')
            email = EmailMessage(mail_subject, message, to=[to_email])
            email.send()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
