from rest_framework import viewsets
from ecoboros_api.models import PurchaseRequests
from ecoboros_api.serializers.purchase_request_serializer import PurchaseRequestSerializer

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PurchaseRequestSerializer

    def get_queryset(self):
        queryset = PurchaseRequests.objects.select_related(
            'waste', 'waste__publisher', 'waste__quality_validator', 'buyer', 'status', 'quality_validator'
        ).all().order_by('-request_id')
        buyer_id = self.request.query_params.get('buyer')
        publisher_id = self.request.query_params.get('publisher')
        status_id = self.request.query_params.get('status')
        quality_validator_id = self.request.query_params.get('quality_validator')
        unassigned_validator = self.request.query_params.get('unassigned_validator')

        if buyer_id:
            queryset = queryset.filter(buyer_id=buyer_id)
        if publisher_id:
            queryset = queryset.filter(waste__publisher_id=publisher_id)
        if status_id:
            queryset = queryset.filter(status_id=status_id)
        if quality_validator_id:
            queryset = queryset.filter(quality_validator_id=quality_validator_id)
        if unassigned_validator == 'true':
            queryset = queryset.filter(quality_validator__isnull=True)
        return queryset