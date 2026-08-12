from rest_framework import serializers
from ecoboros_api.models import Reports

class ReportSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='reported_by.contact_email')
    company = serializers.ReadOnlyField(source='reported_by.company_name')
    publicationTitle = serializers.ReadOnlyField(source='waste.title')
    publicationId = serializers.ReadOnlyField(source='waste.waste_id')
    date = serializers.SerializerMethodField()
    id = serializers.ReadOnlyField(source='report_id')

    class Meta:
        model = Reports
        fields = [
            'id', 'report_id', 'waste', 'reported_by', 'type', 
            'description', 'status', 'created_at', 'user', 
            'company', 'publicationTitle', 'publicationId', 'date'
        ]

    def get_date(self, obj):
        if obj.created_at:
            return obj.created_at.strftime('%Y-%m-%d')
        return None
