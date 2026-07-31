from rest_framework import serializers
from ecoboros_api.models import PurchaseRequests

class PurchaseRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseRequests
        fields = '__all__'