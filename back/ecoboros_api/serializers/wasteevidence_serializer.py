from rest_framework import serializers
from ecoboros_api.models import Wasteevidences

class WasteevidencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wasteevidences
        fields = '__all__'