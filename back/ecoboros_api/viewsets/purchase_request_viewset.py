from rest_framework import viewsets
from ecoboros_api.models import PurchaseRequests
from ecoboros_api.serializers.purchase_request_serializer import PurchaseRequestSerializer

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequests.objects.all()
    serializer_class = PurchaseRequestSerializer