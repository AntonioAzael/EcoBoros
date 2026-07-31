from rest_framework import viewsets
from ecoboros_api.models import AuditLogs
from ecoboros_api.serializers.audit_log_serializer import AuditLogSerializer

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLogs.objects.all()
    serializer_class = AuditLogSerializer