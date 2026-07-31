from rest_framework import viewsets
from ecoboros_api.models import Categories
from ecoboros_api.serializers.category_serializer import CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Categories.objects.all()
    serializer_class = CategorySerializer