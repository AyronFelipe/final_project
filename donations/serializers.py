from rest_framework import serializers
from .models import Donation, Solicitation
from core.serializers import PhotoSerializer, TagSerializer


class DonationSerializer(serializers.ModelSerializer):

    photos = PhotoSerializer(many=True, read_only=True)
    tags = serializers.SerializerMethodField()
    solicitations_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    main_photo = serializers.SerializerMethodField()
    donator_pk = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = [
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
            'solicitations_count',
            'status',
            'donator_pk',
        ]

    def get_tags(self, obj):

        if hasattr(obj, 'donation_tags'):
            tag_list = []
            for lol in obj.donation_tags.all():
                tag_list.append(lol.tag)
            serializer = TagSerializer(tag_list, many=True)
            return serializer.data

    def get_solicitations_count(self, obj):

        if hasattr(obj, 'solicitations'):
            return obj.solicitations.count()

    def get_status(self, obj):

        if hasattr(obj, 'status'):
            return obj.get_status_display()
    
    def get_main_photo(self, obj):
        if hasattr(obj, 'main_photo'):
            if obj.main_photo:
                return obj.main_photo.url
            else:
                return '/static/images/default-placeholder.png'

    def get_donator_pk(self, obj):
        if hasattr(obj, 'main_photo'):
            return obj.donator.pk


class SolicitationSerializer(serializers.ModelSerializer):

    owner = serializers.SerializerMethodField()
    owner_pk = serializers.SerializerMethodField()
    owner_photo = serializers.SerializerMethodField()
    owner_username = serializers.SerializerMethodField()
    donation = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
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
            'pk',
            'status',
            'donator_donation_photo',
            'owner_pk',
            'owner_photo',
            'owner_username',
            'created_at',
            'comment',
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

    def get_donator_donation_photo(self, obj):

        if hasattr(obj, 'donation'):
            if hasattr(obj.donation, 'donator'):
                if obj.donation.donator.photo:
                    return obj.donation.donator.photo.url
                else:
                    return '/static/images/default-user-image.png'

    def get_owner_pk(self, obj):

        if hasattr(obj, 'owner'):
            return obj.owner.pk

    def get_owner_photo(self, obj):

        if hasattr(obj, 'owner'):
            if obj.owner.photo:
                return obj.owner.photo.url
            else:
                return '/static/images/default-user-image.png'

    def get_owner_username(self, obj):

        if hasattr(obj, 'owner'):
            return obj.owner.username


class DonationEmptySerializer(serializers.ModelSerializer):

    donator_name = serializers.SerializerMethodField()
    donator_username = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    receiver_username = serializers.SerializerMethodField()

    class Meta:
        model = Donation
        fields = [
            'name',
            'validity',
            'validity_hour',
            'main_photo',
            'pk',
            'slug',
            'donator',
            'receiver',
            'donator_name',
            'receiver_name',
            'donator_username',
            'receiver_username',
        ]

    def get_donator_name(self, obj):

        return obj.donator.get_name()

    def get_receiver_name(self, obj):

        if obj.receiver:
            return obj.receiver.get_name()

    def get_donator_username(self, obj):

        return obj.donator.username

    def get_receiver_username(self, obj):

        if obj.receiver:
            return obj.receiver.username