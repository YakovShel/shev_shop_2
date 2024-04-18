import heapq

from django.urls import path

from carts import views
from carts.views import CartAddAPIView, CartChangeAPIView, CartRemoveAPIView

app_name = 'carts'

urlpatterns = [
    path('cart_add/', CartAddAPIView.as_view(), name='cart_add'),
    path('cart_change/', CartChangeAPIView.as_view(), name='cart_change'),
    path('cart_remove/', CartRemoveAPIView.as_view(), name='cart_remove'),
]
