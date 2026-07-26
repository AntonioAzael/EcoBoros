from rest_framework import serializers
from ecoboros_api.models import Wastestatuslogs

class WastestatuslogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wastestatuslogs
        fields = '__all__'