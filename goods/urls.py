"""
URL configuration for shev project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import heapq

from django.urls import path

from goods import views
from goods.views import ProductDetailAPIView, CatalogAPIView

app_name = 'goods'

urlpatterns = [
    path('search/', CatalogAPIView.as_view(), name='search'),
    path('<slug:category_slug>/', CatalogAPIView.as_view(), name='index'),
    path('product/<int:product_id>/', ProductDetailAPIView.as_view(), name='product'),
    path('product/<slug:product_slug>/', ProductDetailAPIView.as_view(), name='product'),
]
