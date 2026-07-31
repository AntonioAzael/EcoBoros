from rest_framework import viewsets
from ecoboros_api.models import Statuses
from ecoboros_api.serializers.status_serializer import StatusSerializer

class StatusViewSet(viewsets.ModelViewSet):
    queryset = Statuses.objects.all()
    serializer_class = StatusSerializer