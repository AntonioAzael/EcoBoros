from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ecoboros_api.models import Reports
from ecoboros_api.serializers.report_serializer import ReportSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Reports.objects.all()
    serializer_class = ReportSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'status', 'waste']
    search_fields = ['description', 'reported_by__contact_email', 'reported_by__company_name']
