from rest_framework import serializers
from .models import Photo, Tag, Notification


class PhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Photo
        fields = [
            'image_file',
            'donation',
            'pk'
        ]


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = [
            'name',
            'pk',
        ]


class NotificationSerializer(serializers.ModelSerializer):

    sender = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'message',
            'pk',
            'sender',
        ]

    def get_sender(self, obj):

        if hasattr(obj, 'sender'):
            return obj.sender.photo.url