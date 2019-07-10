from rest_framework import serializers
from .models import *
from accounts.serializers import UserSerializer


class DemandSerializer(serializers.ModelSerializer):

    main_photo = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Demand
        fields = [
            'name',
            'description',
            'slug',
            'owner',
            'main_photo',
            'quantity',
            'unit_measurement',
        ]

    def get_owner(self, obj):

        if hasattr(obj, 'owner'):
            return UserSerializer(obj.owner).data

    def get_main_photo(self, obj):
        if hasattr(obj, 'main_photo'):
            return obj.main_photo.url


class DemandCardSerializer(serializers.ModelSerializer):

    main_photo = serializers.SerializerMethodField()
    identifier = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Demand
        fields = [
            'name',
            'description',
            'slug',
            'owner',
            'main_photo',
            'quantity',
            'unit_measurement',
            'pk',
            'identifier',
        ]
    
    def get_main_photo(self, obj):

        if hasattr(obj, 'main_photo'):
            return obj.main_photo.url

    def get_identifier(self, obj):

        if hasattr(obj, 'owner'):
            if obj.owner.person:
                return 'Pessoa'
            else:
                return 'Instituição'

    def get_owner(self, obj):

        if hasattr(obj, 'owner'):
            return UserSerializer(obj.owner).data
