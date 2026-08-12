from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from ecoboros_api.models import Users
from ecoboros_api.serializers.user_serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role', 'is_active']
    search_fields = ['company_name', 'rfc', 'contact_email']