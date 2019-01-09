from rest_framework import serializers
from .models import *


class DemandSerializer(serializers.Serializer):

	class Meta:
		model = Demand
		fields = [
			'name',
			'description',
			'slug',
			'owner',
			'main_photo',
			'quantity',
			'unit_measurement',
		]
