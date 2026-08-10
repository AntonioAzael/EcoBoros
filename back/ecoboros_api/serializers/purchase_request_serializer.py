from rest_framework import serializers
from ecoboros_api.models import PurchaseRequests, Statuses, Users

class PurchaseRequestSerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField(read_only=True)
    seller_name = serializers.SerializerMethodField(read_only=True)
    buyer_name = serializers.SerializerMethodField(read_only=True)
    status_name = serializers.SerializerMethodField(read_only=True)
    quality_validator_name = serializers.SerializerMethodField(read_only=True)
    date = serializers.SerializerMethodField(read_only=True)
    total_amount = serializers.SerializerMethodField(read_only=True)
    total_formatted = serializers.SerializerMethodField(read_only=True)
    platform_fee = serializers.SerializerMethodField(read_only=True)
    platform_fee_formatted = serializers.SerializerMethodField(read_only=True)
    seller_payout = serializers.SerializerMethodField(read_only=True)
    seller_payout_formatted = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PurchaseRequests
        fields = [
            'request_id',
            'waste',
            'buyer',
            'requested_weight',
            'offered_price',
            'quantity',
            'negotiation_comment',
            'status',
            'quality_validator',
            'quality_validator_name',
            'seller_payment_confirmed',
            'platform_fee_confirmed',
            'request_date',
            'response_date',
            'product_name',
            'seller_name',
            'buyer_name',
            'status_name',
            'date',
            'total_amount',
            'total_formatted',
            'platform_fee',
            'platform_fee_formatted',
            'seller_payout',
            'seller_payout_formatted',
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

    def get_quality_validator_name(self, obj):
        try:
            return obj.quality_validator.company_name if obj.quality_validator else None
        except Exception:
            return None

    def get_date(self, obj):
        if obj.request_date:
            return obj.request_date.strftime('%Y-%m-%d')
        return ""

    def get_total_amount(self, obj):
        try:
            weight = float(obj.requested_weight or 0)
            price = float(obj.offered_price or 0)
            total = weight * price if (weight > 0 and price > 0) else price
            return round(total, 2)
        except Exception:
            return 0.0

    def get_total_formatted(self, obj):
        total = self.get_total_amount(obj)
        return f"$ {total:,.2f}"

    def get_platform_fee(self, obj):
        # 2.5% para el Software Intermediario (mantenimiento y sueldos de calidad)
        total = self.get_total_amount(obj)
        return round(total * 0.025, 2)

    def get_platform_fee_formatted(self, obj):
        fee = self.get_platform_fee(obj)
        return f"$ {fee:,.2f}"

    def get_seller_payout(self, obj):
        # 97.5% de ganancia para la Empresa B
        total = self.get_total_amount(obj)
        return round(total * 0.975, 2)

    def get_seller_payout_formatted(self, obj):
        payout = self.get_seller_payout(obj)
        return f"$ {payout:,.2f}"

    def update(self, instance, validated_data):
        # Regla: Si el estado actual es Completado (status_id = 6), no se permite ningún cambio
        current_status_id = instance.status.status_id if instance.status else None
        if current_status_id == 6 or (instance.status and instance.status.status_name.lower() == 'completado'):
            raise serializers.ValidationError(
                {"status": "La solicitud de compra ya está en estado Completado y no se puede modificar."}
            )

        new_status = validated_data.get('status', instance.status)

        # Si se transiciona a Proceso (status_id = 5), asegurar que se registra el usuario de calidad validator
        if new_status and (getattr(new_status, 'status_id', None) == 5 or getattr(new_status, 'status_name', '').lower() in ['proceso', 'en proceso']):
            if not validated_data.get('quality_validator') and not instance.quality_validator:
                # Asignar usuario de calidad por defecto si no se especificó
                default_validator = Users.objects.filter(role__role_name__icontains='Calidad').first()
                if default_validator:
                    validated_data['quality_validator'] = default_validator

        # Si se transiciona a Completado (status_id = 6), marcar confirmaciones de pago
        if new_status and (getattr(new_status, 'status_id', None) == 6 or getattr(new_status, 'status_name', '').lower() == 'completado'):
            validated_data['seller_payment_confirmed'] = True
            validated_data['platform_fee_confirmed'] = True

        return super().update(instance, validated_data)