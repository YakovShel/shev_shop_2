from django.shortcuts import render

from goods.models import Products


def catalog(request):

    goods = Products.objects.all()

    context = {
        'title': 'Home catalog',
        'goods': goods,
    }

    return render(request, 'goods/catalog.html', context)


def product(request, product_slug=False, product_id=False):

    if product_id:
        product = Products.objects.get(id=product_id)
    else:
        product = Products.objects.get(slug=product_slug)

    context = {
        'product': product
    }

    return render(request, 'goods/product.html', context=context)
