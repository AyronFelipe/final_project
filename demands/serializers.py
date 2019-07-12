from rest_framework import serializers
from .models import *
from accounts.serializers import UserSerializer


class DemandSerializer(serializers.ModelSerializer):

    main_photo = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    unit_measurement = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    quantity_received = serializers.SerializerMethodField()

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
            'status',
            'quantity_received',
        ]

    def get_owner(self, obj):

        if hasattr(obj, 'owner'):
            return UserSerializer(obj.owner).data

    def get_main_photo(self, obj):
        if hasattr(obj, 'main_photo'):
            return obj.main_photo.url

    def get_unit_measurement(self, obj):
        if hasattr(obj, 'unit_measurement'):
            return obj.unit_measurement.name

    def get_status(self, obj):
        if hasattr(obj, 'status'):
            return obj.get_status_display()

    def get_quantity_received(self, obj):

        sum = 0
        if hasattr(obj, 'gifts'):
            for temp in obj.gifts.all():
                sum = sum + temp.quantity
        return sum
