from rest_framework import serializers
from ecoboros_api.models import Auditlogs

class AuditlogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Auditlogs
        fields = '__all__'