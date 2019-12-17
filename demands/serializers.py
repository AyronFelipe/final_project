from rest_framework import serializers
from .models import *
from accounts.serializers import UserSerializer
from core.serializers import TagSerializer


class DemandSerializer(serializers.ModelSerializer):

    main_photo = serializers.SerializerMethodField()
    owner_pk = serializers.SerializerMethodField()
    unit_measurement = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    quantity_received = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Demand
        fields = [
            'name',
            'description',
            'slug',
            'owner_pk',
            'main_photo',
            'quantity',
            'unit_measurement',
            'status',
            'quantity_received',
            'pk',
            'tags',
        ]

    def get_owner_pk(self, obj):
        if hasattr(obj, 'owner'):
            return obj.owner.pk

    def get_main_photo(self, obj):
        if hasattr(obj, 'main_photo'):
            if obj.main_photo:
                return obj.main_photo.url
            else:
                return '/static/images/default-placeholder.png'

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

    def get_tags(self, obj):

        if hasattr(obj, 'demand_tags'):
            tag_list = []
            for lol in obj.demand_tags.all():
                tag_list.append(lol.tag)
            serializer = TagSerializer(tag_list, many=True)
            return serializer.data


class GiftSerializer(serializers.ModelSerializer):

    class Meta:
        model = Gift
        fields = '__all__'
