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
    donation = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    donator_donation_pk = serializers.SerializerMethodField()
    donator_donation_photo = serializers.SerializerMethodField()

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
            'donator_donation_pk',
            'donator_donation_photo',
        ]

    def get_owner(self, obj):

        if hasattr(obj, 'owner'):
            if hasattr(obj.owner, 'institution'):
                return obj.owner.institution.name
            return obj.owner.person.first_name

    def get_donation(self, obj):

        if hasattr(obj, 'donation'):
            serializer = DonationSerializer(obj.donation)
            return serializer.data

    def get_status(self, obj):
        if hasattr(obj, 'status'):
            return obj.get_status_display()

    def get_donator_donation_pk(self, obj):

        if hasattr(obj, 'donation'):
            if hasattr(obj.donation, 'donator'):
                return obj.donation.donator.id

    def get_donator_donation_photo(self, obj):

        if hasattr(obj, 'donation'):
            if hasattr(obj.donation, 'donator'):
                return obj.donation.donator.photo.url