from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
from django.contrib import auth, messages
from django.urls import reverse
from django.db.models import Prefetch
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer, JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login

from carts.models import Cart
from orders.models import Order, OrderItem
from users.forms import ProfileForm
from users.serializers import UserLoginSerializer, UserRegistrationSerializer


class UserLoginAPIView(APIView):
    renderer_classes = [TemplateHTMLRenderer, JSONRenderer]
    template_name = 'users/login.html'

    def get(self, request, *args, **kwargs):
        form = UserLoginSerializer()
        if request.accepted_renderer.format == 'html':
            # Возвращаем HTML-форму, если клиент ожидает HTML
            return Response({'form': form})
        else:
            # Возвращаем JSON-сообщение, если клиент ожидает JSON
            return Response({'message': 'Форма успешно загружена!'}, status=200)


    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(request, username=username, password=password)
            session_key = request.session.session_key

            if user:
                if session_key:
                    Cart.objects.filter(session_key=session_key).update(user=user)
                login(request, user)
                return Response({"message": f"Добро пожаловать, {username}!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Недопустимые учётные данные!"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserRegisterAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    'id': user.id,
                    'is_staff': user.is_staff,
                    'status': 'success',
                    'message': 'Пользователь зарегистрирован успешно!'
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {'status': 'error', 'message': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )



@login_required
def profile(request):
    if request.method == 'POST':
        form = ProfileForm(data=request.POST, instance=request.user, files=request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, "Профайл успешно обновлён!")
            return HttpResponseRedirect(reverse('user:profile'))
    else:
        form = ProfileForm(instance=request.user)
    orders = Order.objects.filter(user=request.user).prefetch_related(
        Prefetch(
            "orderitem_set",
            queryset=OrderItem.objects.select_related("product"),
        )
    ).order_by("-id")
    context = {
        'title': 'Home - Кабинет',
        'form': form,
        'orders': orders,
    }

    return render(request, 'users/profile.html', context)


class GetCartAPIView(APIView):
    renderer_classes = [TemplateHTMLRenderer, JSONRenderer]
    template_name = 'users/users_cart.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            carts = Cart.objects.filter(user=request.user).select_related('product')
        else:
            if not request.session.session_key:
                request.session.create()
            carts = Cart.objects.filter(session_key=request.session.session_key).select_related('product')

        if request.accepted_renderer.format == 'html':
            return Response({'carts': carts})
        else:
            return Response({'carts': carts, 'message': 'Корзина успешно загружена!'}, status=200)



class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        auth.logout(request)
        return Response({"message": "Вы успешно вышли из аккаунта!"}, status=status.HTTP_200_OK)