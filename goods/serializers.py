from rest_framework import serializers
from .models import Products


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = ['id', 'name', 'slug', 'description', 'price', 'discount', 'quantity', 'image']