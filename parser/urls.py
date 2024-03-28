from django.urls import path

from parser import views

app_name = 'parser'

urlpatterns = [
    path('', views.parse, name='parse'),
]
