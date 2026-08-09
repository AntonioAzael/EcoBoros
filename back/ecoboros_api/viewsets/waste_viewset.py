from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from ecoboros_api.models import Wastes
from ecoboros_api.serializers.waste_serializer import WasteSerializer


class WasteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de residuos (wastes).
    - Acepta multipart/form-data para subida de archivos de evidencia.
    - Soporta filtro por publisher_id (?publisher=<id>).
    - Las respuestas GET incluyen category_name, status_name, evidence_files y first_image_url.
    """
    queryset = Wastes.objects.select_related(
        'category', 'status', 'publisher'
    ).prefetch_related('wasteevidences_set').all()
    serializer_class = WasteSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['publisher', 'category', 'status']

    def get_serializer_context(self):
        """Pasar request al serializer para construir URLs absolutas de archivos."""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context