from rest_framework import serializers
from ecoboros_api.models import PurchaseRequests

class PurchaseRequestSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField(read_only=True)
    seller_name = serializers.SerializerMethodField(read_only=True)
    buyer_name = serializers.SerializerMethodField(read_only=True)
    status_name = serializers.SerializerMethodField(read_only=True)
    date = serializers.SerializerMethodField(read_only=True)
    total_formatted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PurchaseRequests
        fields = [
            'request_id',
            'waste',
            'buyer',
            'requested_weight',
            'offered_price',
            'status',
            'request_date',
            'response_date',
            'product_name',
            'seller_name',
            'buyer_name',
            'status_name',
            'date',
            'total_formatted',
        ]

    def get_product_name(self, obj):
        try:
            return obj.waste.title if obj.waste else "Residuo Industrial"
        except Exception:
            return "Residuo Industrial"

    def get_seller_name(self, obj):
        try:
            return obj.waste.publisher.company_name if (obj.waste and obj.waste.publisher) else "Vendedor Verificado"
        except Exception:
            return "Vendedor Verificado"

    def get_buyer_name(self, obj):
        try:
            return obj.buyer.company_name if obj.buyer else "Comprador Verificado"
        except Exception:
            return "Comprador Verificado"

    def get_status_name(self, obj):
        try:
            return obj.status.status_name if obj.status else "Pendiente"
        except Exception:
            return "Pendiente"

    def get_date(self, obj):
        if obj.request_date:
            return obj.request_date.strftime('%Y-%m-%d')
        return ""

    def get_total_formatted(self, obj):
        try:
            weight = float(obj.requested_weight or 0)
            price = float(obj.offered_price or 0)
            total = weight * price if (weight > 0 and price > 0) else price
            return f"$ {total:,.2f}"
        except Exception:
            return "$ 0.00"