from rest_framework import viewsets
from ecoboros_api.models import Users
from ecoboros_api.serializers.user_serializer import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UserSerializer