from rest_framework import serializers
from .models import Donation


class DonationSerializer(serializers.ModelSerializer):

    #donator = serializers.StringRelatedField()

    class Meta:
        model = Donation
        fields = ['photos', 'name', 'description', 'validity', 'validity_hour', 'main_photo', 'neighborhood', 'street', 'number', 'cep', 'uf', 'city', 'complement', 'pk', 'slug']