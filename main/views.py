from django.http import HttpResponse, JsonResponse

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

class AuthCheckAPIView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        # Проверяем, аутентифицирован ли пользователь
        if request.user.is_authenticated:
            # Пользователь аутентифицирован
            return Response({
                "is_authenticated": True,
                "is_staff": request.user.is_staff,
                "status": "success",
                "message": "Пользователь авторизован!"
            })
        else:
            # Пользователь не аутентифицирован
            return Response({
                "is_authenticated": False,
                "is_staff": False,
                "status": "success",
                "message": "Пользователь не авторизован!"
            })

class AboutAPIView(APIView):
    def get(self, request):
        data = {
            'content': "Текст о том, почему наш магазин лучше всех!",
            'status': "success",
            'message': "Информация о преимуществах передана!"
        }
        return JsonResponse(data)