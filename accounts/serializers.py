from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Person, Institution
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate
from django.conf import settings
from donations.serializers import DonationSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    child = serializers.SerializerMethodField()
    donations_count = serializers.SerializerMethodField()
    donations_accepted = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'complement',
            'cell_phone',
            'cep',
            'city',
            'complement',
            'email',
            'pk',
            'is_active',
            'neighborhood',
            'number',
            'phone',
            'photo',
            'street',
            'uf',
            'child',
            'donations_count',
            'donations_accepted',
        ]

    def get_child(self, obj):

        if hasattr(obj, 'institution'):
            serializer = LoggedInstitutionSerializer(obj.institution)
        serializer = LoggedPersonSerializer(obj.person)
        return serializer.data

    def get_donations_count(self, obj):

        return obj.donated_donations.count()

    def get_donations_accepted(self, obj):

        return obj.donated_donations.filter(is_accepted=True).count()
    
    def get_photo(self, obj):

        return obj.photo.url


class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person
        fields = [
            'email',
            'password',
            'is_active',
            'first_name',
            'last_name',
            'cpf',
            'phone',
            'cell_phone',
            'neighborhood',
            'street',
            'number',
            'birthday',
            'cep',
            'complement',
            'city',
            'uf',
            'photo',
        ]


class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = [
            'email',
            'password',
            'is_active',
            'name',
            'cnpj',
            'phone',
            'cell_phone',
            'neighborhood',
            'street',
            'number',
            'photo',
            'cep',
            'complement'
            'city',
            'uf',
            'photo',
            'objectives',
        ]


class LoggedPersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person
        fields = [
            'first_name',
            'last_name',
            'cpf',
            'birthday',
        ]


class LoggedInstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = [
            'name',
            'cnpj',
            'objectives',
        ]