from rest_framework import viewsets
from ecoboros_api.models import WasteEvidences
from ecoboros_api.serializers.waste_evidence_serializer import WasteEvidenceSerializer

class WasteEvidenceViewSet(viewsets.ModelViewSet):
    queryset = WasteEvidences.objects.all()
    serializer_class = WasteEvidenceSerializer