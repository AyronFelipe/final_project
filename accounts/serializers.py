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

    class Meta:
        model = User
        fields = [
            'cell_phone',
            'cep',
            'city',
            'complement',
            'email',
            'id',
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
            serializer = InstitutionSerializer(obj.institution)
        serializer = PersonSerializer(obj.person)
        return serializer.data

    def get_donations_count(self, obj):

        return obj.donated_donations.count()

    def get_donations_accepted(self, obj):

        return obj.donated_donations.filter(is_accepted=True).count()


class PersonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Person
        fields = [
            'first_name', 
            'last_name',
            'cpf', 
            'birthday',
        ]


class InstitutionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Institution
        fields = [
            'name', 
            'cnpj', 
            'objectives',
        ]
