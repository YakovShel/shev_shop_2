from django.http import JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.template.loader import render_to_string
from requests import Response, Session
from rest_framework import status
from rest_framework.views import APIView

from carts.models import Cart
from carts.serializers import CartSerializer
from goods.models import Products
from carts.utils import get_user_carts

from goods.models import Products
from users.models import User


class CartAddAPIView(APIView):

    def post(self, request):
        # Получаем данные из запроса
        product_id = request.data.get("product_id")
        user_id = request.data.get("user_id", None)
        session_key = request.data.get("session_key", None)

        # Получаем объект продукта или возвращаем ошибку 404
        product = get_object_or_404(Products, id=product_id)

        # Проверяем аутентификацию пользователя
        if user_id:
            user = get_object_or_404(User, id=user_id)
            cart, created = Cart.objects.get_or_create(user=user, product=product)
        else:
            # В случае неаутентифицированного пользователя используем session_key
            if not session_key:
                return Response(
                    {"message": "Необходим ключ сессии для неаутентифицированных пользователей."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            # Убедимся, что сессия существует
            session = Session.objects.get_or_create(session_key=session_key)
            cart, created = Cart.objects.get_or_create(session_key=session.session_key, product=product)

        # Обновляем количество, если товар уже в корзине
        if not created:
            cart.quantity += 1
            cart.save(update_fields=['quantity'])

        # Подготовка данных для ответа
        cart_data = {
            "id": cart.id,
            "quantity": cart.quantity,
            "session_key": cart.session_key if not user_id else None,
            "product_id": cart.product_id,
            "user_id": user_id
        }

        if created:
            cart_data["created_timestamp"] = cart.created.timestamp().isoformat()

        return JsonResponse({
            "cart": [cart_data],
            "status": "success",
            "message": "Товар успешно добавлен!"
        }, safe=False)


class CartChangeAPIView(APIView):

    def post(self, request):
        product_id = request.data.get("product_id")
        user_id = request.data.get("user_id")
        session_key = request.data.get("session_key")
        quantity = request.data.get("quantity")

        try:
            if user_id:
                cart_item = Cart.objects.get(user_id=user_id, product_id=product_id)
            else:
                cart_item = Cart.objects.get(session_key=session_key, product_id=product_id)
        except Cart.DoesNotExist:
            return Response(
                {"status": "error", "message": "Товар в корзине не найден."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Устанавливаем новое количество
        cart_item.quantity = quantity
        cart_item.save()

        return Response({
            "cart": {
                "id": cart_item.id,
                "quantity": cart_item.quantity,
                "product_id": cart_item.product_id,
                "user_id": cart_item.user_id if user_id else None,
                "session_key": cart_item.session_key if session_key else None,
                "created_timestamp": cart_item.created.timestamp().isoformat()
            },
            "status": "success",
            "message": "Количество товара изменено!"
        })


class CartRemoveAPIView(APIView):

    def delete(self, request, format=None):
        product_id = request.data.get("product_id")
        user_id = request.data.get("user_id")
        session_key = request.data.get("session_key")

        # Получаем объект корзины для удаления
        try:
            if user_id is not None:
                cart_item = get_object_or_404(Cart, user_id=user_id, product_id=product_id)
            else:
                cart_item = get_object_or_404(Cart, session_key=session_key, product_id=product_id)

            cart_item.delete()  # Удаляем товар из корзины

            # Получаем обновленный список товаров в корзине
            if user_id is not None:
                remaining_items = Cart.objects.filter(user_id=user_id)
            else:
                remaining_items = Cart.objects.filter(session_key=session_key)

            # Сериализуем оставшиеся товары в корзине
            cart_serializer = CartSerializer(remaining_items, many=True)

            return Response({
                "cart": cart_serializer.data,  # Список оставшихся товаров
                "status": "success",
                "message": "Товар удален!"
            })

        except Cart.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Товар в корзине не найден."
            }, status=404)