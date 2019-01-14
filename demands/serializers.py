from rest_framework import serializers
from .models import *


class DemandSerializer(serializers.ModelSerializer):

    main_photo = serializers.SerializerMethodField()

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


class DemandCardSerializer(serializers.ModelSerializer):

    main_photo = serializers.SerializerMethodField()
    owner_main_photo = serializers.SerializerMethodField()

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
            'owner_main_photo',
            'pk'
        ]
    
    def get_main_photo(self, obj):

        if hasattr(obj, 'main_photo'):
            return obj.main_photo.url

    def get_owner_main_photo(self, obj):

        if hasattr(obj, 'owner'):
            return obj.owner.photo.url
