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
    
    def get_main_photo(self, obj):

        if hasattr(obj, 'main_photo'):
            return obj.main_photo.url
