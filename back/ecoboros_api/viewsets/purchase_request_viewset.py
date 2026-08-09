from rest_framework import viewsets
from ecoboros_api.models import PurchaseRequests
from ecoboros_api.serializers.purchase_request_serializer import PurchaseRequestSerializer

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseRequestSerializer

    def get_queryset(self):
        queryset = PurchaseRequests.objects.select_related(
            'waste', 'waste__publisher', 'buyer', 'status'
        ).all()
        buyer_id = self.request.query_params.get('buyer')
        publisher_id = self.request.query_params.get('publisher')
        if buyer_id:
            queryset = queryset.filter(buyer_id=buyer_id)
        if publisher_id:
            queryset = queryset.filter(waste__publisher_id=publisher_id)
        return queryset