from rest_framework import serializers
from ecoboros_api.models import Roles

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = '__all__'