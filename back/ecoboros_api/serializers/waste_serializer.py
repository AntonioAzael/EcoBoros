from rest_framework import serializers
from ecoboros_api.models import Wastes

class WasteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wastes
        fields = '__all__'