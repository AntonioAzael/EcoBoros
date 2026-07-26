from rest_framework import viewsets
from ecoboros_api.models import Wastestatuslogs
from ecoboros_api.serializers.wastestatuslog_serializer import WastestatuslogsSerializer

class WastestatuslogsViewSet(viewsets.ModelViewSet):
    queryset = Wastestatuslogs.objects.all()
    serializer_class = WastestatuslogsSerializer