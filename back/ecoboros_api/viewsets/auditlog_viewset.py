from rest_framework import viewsets
from ecoboros_api.models import Auditlogs
from ecoboros_api.serializers.auditlog_serializer import AuditlogsSerializer

class AuditlogsViewSet(viewsets.ModelViewSet):
    queryset = Auditlogs.objects.all()
    serializer_class = AuditlogsSerializer