from rest_framework import serializers
from .models import Photo, Tag, Notification, UnitMeasurement, Comment
from django.contrib.humanize.templatetags.humanize import naturaltime


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
    naturaltime = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'message',
            'pk',
            'sender',
            'created_at',
            'type',
            'unread',
            'naturaltime',
        ]

    def get_sender(self, obj):

        if hasattr(obj, 'sender'):
            if obj.sender.photo:
                return obj.sender.photo.url
            else:
                return '/static/images/default-user-image.png'
    
    def get_naturaltime(self, obj):

        return naturaltime(obj.created_at)



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
            'donation',
        ]


class CommentShowSerializer(serializers.ModelSerializer):

    naturaltime = serializers.SerializerMethodField()
    photo_commenter = serializers.SerializerMethodField()
    commenter_name = serializers.SerializerMethodField()
    commenter_username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'pk',
            'content',
            'commenter',
            'donation',
            'naturaltime',
            'photo_commenter',
            'commenter_name',
            'commenter_username',
        ]
    
    def get_naturaltime(self, obj):

        return naturaltime(obj.created_at)

    def get_photo_commenter(self, obj):

        if obj.commenter.photo:
            return obj.commenter.photo.url
        else:
            return '/static/images/default-user-image.png'

    def get_commenter_name(self, obj):

        if obj.commenter:
            return obj.commenter.get_name()

    def get_commenter_username(self, obj):

        if obj.commenter:
            return obj.commenter.username