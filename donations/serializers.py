from rest_framework import serializers
from .models import Donation


class DonationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Donation
        fields = ['name', 'description', 'validity', 'validity_hour', 'photo', 'neighborhood', 'street', 'number', 'cep', 'uf', 'city', 'complement', 'pk', 'slug']