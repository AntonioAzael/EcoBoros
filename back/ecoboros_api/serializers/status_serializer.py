from rest_framework import serializers
from ecoboros_api.models import Statuses

class StatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statuses
        fields = '__all__'