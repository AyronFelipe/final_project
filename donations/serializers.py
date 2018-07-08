from rest_framework import serializers
from .models import Donation
from core.serializers import PhotoSerializer


class DonationSerializer(serializers.ModelSerializer):

    donator = serializers.SerializerMethodField()
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

    def get_donator(self, obj):

        if hasattr(obj, 'donator'):
            if hasattr(obj.donator, 'institution'):
                return obj.donator.institution.name
            return obj.donator.person.first_name
