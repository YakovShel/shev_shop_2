from django.http import HttpResponse
from django.shortcuts import render

from goods.models import Categories

def index(request):
    categories = Categories.objects.all()

    context = {
        'title': "Home - Главная",
        'content': 'Магазин мебели Home',
        'categories': categories
    }
    return render(request, 'main/index.html', context)


def about(request):
    context = {
        'title': "Home - О нас",
        'content': 'О нас',
        'text_on_page': 'Текст о том, почему наш магазин лучше всех!'
    }
    return render(request, 'main/about.html', context)