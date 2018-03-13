from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Person, Institution
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate
from django.conf import settings

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person
        fields = ['email', 'password', 'is_active', 'first_name', 'last_name', 'cpf', 'phone', 'cell_phone', 'neighborhood', 'street', 'number', 'birthday']


class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = ['email', 'password', 'is_active', 'name', 'cnpj', 'phone', 'cell_phone', 'neighborhood', 'street', 'number']
