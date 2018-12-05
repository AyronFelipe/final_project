from rest_framework import serializers
from .models import Photo, Tag, Notification, UnitMeasurement, Comment


class PhotoSerializer(serializers.ModelSerializer):

    image_file = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = [
            'image_file',
            'donation',
            'pk'
        ]
    
    def get_image_file(self, obj):
        if hasattr(obj, 'image_file'):
            return obj.image_file.url


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
            'created_at',
            'type',
            'unread',
        ]

    def get_sender(self, obj):

        if hasattr(obj, 'sender'):
            return obj.sender.photo.url


class UnitMeasurementSerializer(serializers.ModelSerializer):

    class Meta:
        model = UnitMeasurement
        fields = [
            'pk',
            'initials',
            'name'
        ]


class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = [
            'content',
            'commenter',
            'commented',
        ]