from rest_framework import serializers
from ecoboros_api.models import AuditLogs

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLogs
        fields = '__all__'