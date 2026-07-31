from rest_framework import serializers
from ecoboros_api.models import WasteStatusLogs

class WasteStatusLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteStatusLogs
        fields = '__all__'