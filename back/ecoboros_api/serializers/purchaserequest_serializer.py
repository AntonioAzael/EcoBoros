from rest_framework import serializers
from ecoboros_api.models import Purchaserequests

class PurchaserequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchaserequests
        fields = '__all__'