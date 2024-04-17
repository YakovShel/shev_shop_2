from django.core.paginator import Paginator
from django.shortcuts import render, get_list_or_404

from goods.utils import q_search
from .serializers import ProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Products


class CatalogAPIView(APIView):
    def get(self, request, category_slug=None):
        page = request.GET.get('page', 1)
        on_sale = request.GET.get('on_sale', None)
        order_by = request.GET.get('order_by', 'price')
        query = request.GET.get('q', None)

        if query:
            goods = q_search(query)
        elif category_slug:
            goods = Products.objects.filter(category__slug=category_slug)
        else:
            goods = Products.objects.all()

        if on_sale == 'on':
            goods = goods.filter(discount__gt=0)

        if order_by:
            if order_by.startswith('-') or order_by.startswith('+'):
                goods = goods.order_by(order_by)
            else:
                goods = goods.order_by('price')

        paginator = Paginator(goods, 9)
        try:
            current_page = paginator.page(int(page))
        except:
            return Response({'status': 'error', 'message': 'Страница не найдена!'}, status=400)

        serializer = ProductSerializer(current_page, many=True)

        return Response({
            'products': serializer.data,
            'status': 'success',
            'message': 'Товары найдены!' if serializer.data else 'Товары не найдены!'
        })



class ProductDetailAPIView(APIView):

    def get(self, request, product_id=None, product_slug=None):
        try:
            # Пытаемся получить продукт по id или slug
            if product_id is not None:
                product = Products.objects.get(id=product_id)
            elif product_slug is not None:
                product = Products.objects.get(slug=product_slug)
            else:
                return Response({'status': 'error', 'message': 'Не указан ID или slug продукта!'}, status=400)

            # Сериализуем объект продукта
            serializer = ProductSerializer(product)
            response_data = serializer.data
            response_data.update({
                'status': 'success',
                'message': 'Товар успешно получен!'
            })
            return Response(response_data)

        except Products.DoesNotExist:
            return Response({'status': 'error', 'message': 'Такого товара не существует!'}, status=400)
        except Exception as e:
            # Любая другая ошибка, которая не была предвидена
            return Response({'status': 'error', 'message': str(e)}, status=500)


