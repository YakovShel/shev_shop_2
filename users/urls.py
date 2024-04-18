from django.urls import path
from .views import UserLoginAPIView, UserRegisterAPIView, LogoutAPIView, GetCartAPIView
from users import views

app_name = 'users'

urlpatterns = [
    path('login/', UserLoginAPIView.as_view(), name='login'),
    path('registration/', UserRegisterAPIView.as_view(), name='registration'),
    path('profile/', views.profile, name='profile'),
    path('users-cart/', GetCartAPIView.as_view(), name='users_cart'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
]