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
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.conf import settings
from core.utils import send_mail_template
from django.db import transaction
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary.uploader
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import default_token_generator


User = get_user_model()


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
        data["message"] = "Os campos não podem estar em branco."
    else:
        if user is not None:
            if user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key}, status=status.HTTP_200_OK)
            else:
                data["message"] = "O usuário ainda não foi ativo, por favor verifique seu email para poder ativá-lo."
        else:
            data["message"] = "Um dos campos foi preenchido incorretamente."
    return Response(data, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def forget_password(request):
   
    data = {}
    EMAIL_TYPE = 'E'
    type = request.POST.get('type_forget')
    if type == EMAIL_TYPE:
        email = request.POST.get('forget_email')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            data['message'] = 'Usuário não encontrado'
            return Response(data, status=status.HTTP_404_NOT_FOUND,)
        else:
            subject = "Esqueceu sua senha?"
            context = {}
            context['user'] = user
            context['domain'] = get_current_site(request).domain
            context['uid'] = urlsafe_base64_encode(force_bytes(user.pk)).decode()
            context['token'] = default_token_generator.make_token(user)
            context['protocol'] = 'https' if request.is_secure() else 'http'
            send_mail_template(subject, "emails/forget_password_email.html", context, [email])
            return Response(data, status=status.HTTP_200_OK,)



@api_view(["GET"])
def logged_user(request):

    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)


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
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.validated_data
            person = Person(
                email=instance.get('email'), 
                first_name=instance.get('first_name'), 
                last_name=instance.get('last_name'), 
                cpf=instance.get('cpf'), 
                birthday=instance.get('birthday'), 
                phone=instance.get('phone'), 
                cell_phone=instance.get('cell_phone'), 
                neighborhood=instance.get('neighborhood'), 
                street=instance.get('street'), 
                number=instance.get('number'), 
                cep=instance.get("cep"), 
                uf=instance.get("uf"), 
                city=instance.get("city"), 
                complement=instance.get("complement")
            )
            with transaction.atomic():
                person.set_password(instance.get('password'))
                person.photo = request.FILES.get('photo')
                person.save()
                subject = "Ative sua conta"
                context = {}
                context['user'] = person
                context['domain'] = get_current_site(request).domain
                context['uid'] = urlsafe_base64_encode(force_bytes(person.pk)).decode()
                context['token'] = account_activation_token.make_token(person)
                context['protocol'] = 'https' if request.is_secure() else 'http'
                send_mail_template(subject, "emails/activate_email.html", context, [instance.get('email')])
                return Response(serializer.data, status=status.HTTP_201_CREATED,)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateInstitutionViewSet(generics.CreateAPIView):
    '''
    Criação de instituições/usuários
    '''

    permission_classes = (permissions.AllowAny,)
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = InstitutionSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.validated_data
            institution = Institution(
                email=instance.get('email'), 
                name=instance.get('name'), 
                cnpj=instance.get('cnpj'), 
                phone=instance.get('phone'), 
                cell_phone=instance.get('cell_phone'), 
                neighborhood=instance.get('neighborhood'), 
                street=instance.get('street'), 
                number=instance.get('number'), 
                cep=instance.get("cep"), 
                uf=instance.get("uf"), 
                city=instance.get("city"), 
                complement=instance.get("complement")
            )
            with transaction.atomic():
                institution.set_password(instance.get('password'))
                institution.photo = request.FILES.get('photo')
                institution.save()
                subject = "Ative sua conta"
                context = {}
                context['user'] = institution
                context['domain'] = get_current_site(request).domain
                context['uid'] = urlsafe_base64_encode(force_bytes(institution.pk)).decode()
                context['token'] = account_activation_token.make_token(institution)
                context['protocol'] = 'https' if request.is_secure() else 'http'
                send_mail_template(subject, "emails/activate_email.html", context, [instance.get('email')])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def edit_user(request, pk):

    data = {}
    if request.user.pk != int(pk):
        data['message'] = 'Tentando hackear os endpoints né espertão!'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    else:
        user = User.objects.get(pk=pk)
        if request.POST.get('first_name') == '':
            data['message'] = 'Primeiro nome não pode ficar em branco'
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user.person.first_name = request.POST.get('first_name')

        if request.POST.get('last_name') == '':
            data['message'] = 'Sobrenome não pode ficar em branco'
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user.person.last_name = request.POST.get('last_name')
        user.person.birthday = request.POST.get('birthday')
        user.cell_phone = request.POST.get('cell_phone')
        user.phone = request.POST.get('phone')
        user.person.save()
        user.save()
        data['message'] = 'Todas as informações alteradas por você foram salvas.'
        return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def edit_user_address(request, pk):

    data = {}
    if request.user.pk != int(pk):
        data['message'] = 'Tentando hackear os endpoints né espertão!'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    else:
        user = User.objects.get(pk=pk)
        user.neighborhood = request.POST.get('neighborhood')
        user.street = request.POST.get('street')
        user.number = request.POST.get('number')
        user.city = request.POST.get('city')
        user.uf = request.POST.get('uf')
        if request.POST.get('cep') == '':
            data['message'] = 'CEP não pode ficar em branco'
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        else:
            user.cep = request.POST.get('cep')
        user.save()
        data['message'] = 'Todas as informações alteradas por você foram salvas.'
        return Response(data, status=status.HTTP_200_OK)


@api_view(["PUT"])
def edit_user_password(request, pk):

    data = {}
    if request.user.pk != int(pk):
        data['message'] = 'Tentando hackear os endpoints né espertão!'
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    else:
        user = User.objects.get(pk=pk)
        if request.POST.get('old_password') == '' or request.POST.get('old_password2') == '' or request.POST.get('new_password') == '':
            data['message'] = 'Nenhum dos campos pode ficar em branco.'
            return Response(data, status=status.HTTP_401_UNAUTHORIZED)
        else:
            old_password = request.POST.get('old_password')
            if user.check_password(old_password):
                old_password2 = request.POST.get('old_password2')
                if old_password2 != old_password:
                    data['message'] = 'Senha antiga informada não está correta.'
                    return Response(data, status=status.HTTP_401_UNAUTHORIZED)
                else:
                    new_password = request.POST.get('new_password')
                    user.set_password(new_password)
                    user.save()
                    data['message'] = 'Todas as informações alteradas por você foram salvas.'
                    return Response(data, status=status.HTTP_200_OK)
            else:
                data['message'] = 'Senha antiga informada não está correta.'
                return Response(data, status=status.HTTP_401_UNAUTHORIZED)

