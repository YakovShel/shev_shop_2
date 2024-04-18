from django.urls import path

from parser.views import UpdateAssortmentAPI

app_name = 'parser'

urlpatterns = [
    path('', UpdateAssortmentAPI.as_view(), name='parse'),
]
