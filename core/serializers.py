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

    class Meta:
        model = Notification
        fields = [
            'message',
            'pk',
        ]