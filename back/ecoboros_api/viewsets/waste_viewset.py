from rest_framework import viewsets
from ecoboros_api.models import Wastes
from ecoboros_api.serializers.waste_serializer import WasteSerializer

class WasteViewSet(viewsets.ModelViewSet):
    queryset = Wastes.objects.all()
    serializer_class = WasteSerializer