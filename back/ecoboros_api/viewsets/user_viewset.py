from rest_framework import viewsets
from ecoboros_api.models import Users
from ecoboros_api.serializers.user_serializer import UsersSerializer

class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer