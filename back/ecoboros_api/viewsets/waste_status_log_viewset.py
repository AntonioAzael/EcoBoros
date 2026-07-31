from rest_framework import viewsets
from ecoboros_api.models import WasteStatusLogs
from ecoboros_api.serializers.waste_status_log_serializer import WasteStatusLogSerializer

class WasteStatusLogViewSet(viewsets.ModelViewSet):
    queryset = WasteStatusLogs.objects.all()
    serializer_class = WasteStatusLogSerializer