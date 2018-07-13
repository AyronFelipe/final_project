from rest_framework import serializers
from .models import Donation, Solicitation
from core.serializers import PhotoSerializer, TagSerializer

class DonationSerializer(serializers.ModelSerializer):

    donator = serializers.SerializerMethodField()
    photos = PhotoSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()

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
            'photos',
            'tags',
        ]

    def get_donator(self, obj):

        if hasattr(obj, 'donator'):
            if hasattr(obj.donator, 'institution'):
                return obj.donator.institution.name
            return obj.donator.person.first_name

    def get_tags(self, obj):

        if hasattr(obj, 'donation_tags'):
            tag_list = []
            for lol in obj.donation_tags.all():
                tag_list.append(lol.tag)
            serializer = TagSerializer(tag_list, many=True)
            return serializer.data


class SolicitationSerializer(serializers.ModelSerializer):

    owner = serializers.SerializerMethodField()
    donation = DonationSerializer()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Solicitation
        fields = [
            'owner',
            'validity',
            'validity_hour',
            'is_accepted',
            'slug',
            'donation',
            'id',
            'status',
        ]

    def get_owner(self, obj):

        if hasattr(obj, 'owner'):
            if hasattr(obj.owner, 'institution'):
                return obj.owner.institution.name
            return obj.owner.person.first_name

    def get_status(self, obj):

        return obj.get_status_display()
