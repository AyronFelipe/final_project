from rest_framework import serializers
from .models import Donation
from core.serializers import PhotoSerializer


class DonationSerializer(serializers.ModelSerializer):

    donator = serializers.StringRelatedField()
    photos = PhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Donation
        fields = [
            'donator',
            'name',
            'description',
            'validity',
            'validity_hour',
            'main_photo',
            'neighborhood',
            'street',
            'number',
            'cep',
            'uf',
            'city',
            'complement',
            'pk',
            'slug',
            'photos'
        ]