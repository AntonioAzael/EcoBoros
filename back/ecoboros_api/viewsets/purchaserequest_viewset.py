from rest_framework import viewsets
from ecoboros_api.models import Purchaserequests
from ecoboros_api.serializers.purchaserequest_serializer import PurchaserequestsSerializer

class PurchaserequestsViewSet(viewsets.ModelViewSet):
    queryset = Purchaserequests.objects.all()
    serializer_class = PurchaserequestsSerializer