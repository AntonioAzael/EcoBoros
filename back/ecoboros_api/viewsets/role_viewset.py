from rest_framework import viewsets
from ecoboros_api.models import Roles
from ecoboros_api.serializers.role_serializer import RolesSerializer

class RolesViewSet(viewsets.ModelViewSet):
    queryset = Roles.objects.all()
    serializer_class = RolesSerializer