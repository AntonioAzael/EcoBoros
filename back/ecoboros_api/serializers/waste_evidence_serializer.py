from rest_framework import serializers
from ecoboros_api.models import WasteEvidences

class WasteEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteEvidences
        fields = '__all__'