from rest_framework import serializers
from .models import Photo


class PhotoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Photo
        fields = [
            'image_file',
            'donation',
            'pk'
        ]