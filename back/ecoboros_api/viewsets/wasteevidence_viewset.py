from rest_framework import viewsets
from ecoboros_api.models import Wasteevidences
from ecoboros_api.serializers.wasteevidence_serializer import WasteevidencesSerializer

class WasteevidencesViewSet(viewsets.ModelViewSet):
    queryset = Wasteevidences.objects.all()
    serializer_class = WasteevidencesSerializer