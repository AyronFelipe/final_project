from rest_framework import generics, viewsets, permissions
from .models import User, Person, Institution
from .serializers import UserSerializer, PersonSerializer, InstitutionSerializer
from rest_framework.response import Response
from rest_framework import status


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem dos usuários
    '''

    queryset = User.objects.all()
    serializer_class = UserSerializer


class PersonViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Pessoas
    '''

    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class InstitutionViewSet(viewsets.ReadOnlyModelViewSet):
    '''
    Listagem das Instituições
    '''

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
            person = Person(email=instance.get('email'), is_active=instance.get('is_active'), first_name=instance.get('first_name'), last_name=instance.get('last_name'), cpf=instance.get('cpf'), birthday=instance.get('birthday'), phone=instance.get('phone'), cell_phone=instance.get('cell_phone'), neighborhood=instance.get('neighborhood'), street=instance.get('street'), number=instance.get('number'))
            person.set_password(instance.get('password'))
            person.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
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
            institution = Institution(email=instance.get('email'), is_active=instance.get('is_active'), name=instance.get('name'), cnpj=instance.get('cnpj'), phone=instance.get('phone'), cell_phone=instance.get('cell_phone'), neighborhood=instance.get('neighborhood'), street=instance.get('street'), number=instance.get('number'))
            institution.set_password(instance.get('password'))
            institution.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
