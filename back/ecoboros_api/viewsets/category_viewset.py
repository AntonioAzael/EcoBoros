from rest_framework import viewsets
from ecoboros_api.models import Categories
from ecoboros_api.serializers.category_serializer import CategoriesSerializer

class CategoriesViewSet(viewsets.ModelViewSet):
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer