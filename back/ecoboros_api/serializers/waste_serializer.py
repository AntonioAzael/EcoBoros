from rest_framework import serializers
from ecoboros_api.models import Wastes

class WastesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wastes
        fields = '__all__'