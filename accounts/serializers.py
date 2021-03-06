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
    username = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

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
            'username',
            'rating',
        ]

    def get_child(self, obj):

        if hasattr(obj, 'institution'):
            serializer = LoggedInstitutionSerializer(obj.institution)
        else:
            serializer = LoggedPersonSerializer(obj.person)
        return serializer.data

    def get_donations_count(self, obj):

        return obj.donated_donations.count()

    def get_donations_accepted(self, obj):

        return obj.donated_donations.filter(is_accepted=True).count()

    def get_photo(self, obj):
        if obj.photo:
            return obj.photo.url
        else:
            return '/static/images/default-user-image.png'
    
    def get_username(self, obj):

        return obj.username

    def get_rating(self, obj):

        return obj.rating


class PersonSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField()

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

    def get_photo(self, obj):
        if hasattr(obj, 'photo'):
            return obj.photo.url


class InstitutionSerializer(serializers.ModelSerializer):

    photo = serializers.SerializerMethodField()

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
            'complement',
            'city',
            'uf',
            'objectives',
        ]

    def get_photo(self, obj):
        if hasattr(obj, 'photo'):
            return obj.photo.url


class LoggedPersonSerializer(serializers.ModelSerializer):

    type = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = [
            'first_name',
            'last_name',
            'cpf',
            'birthday',
            'type'
        ]

    def get_type(self, obj):

        return 'person'


class LoggedInstitutionSerializer(serializers.ModelSerializer):

    type = serializers.SerializerMethodField()

    class Meta:
        model = Institution
        fields = [
            'name',
            'cnpj',
            'objectives',
            'type'
        ]

    def get_type(self, obj):

        return 'institution'