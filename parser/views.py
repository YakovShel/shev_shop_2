from django.shortcuts import render
import json
import subprocess
import requests

from goods.models import Products, Categories


def parse(request):
    python_script_path = "parser/utils.py"
    subprocess.run(["python", python_script_path])

    json_file_path_age_1 = 'data/age-1-plus-years.json'
    json_file_path_age_4 = 'data/age-4-plus-years.json'
    json_file_path_age_18 = 'data/age-18-plus-years.json'
    json_file_path_ninjago = 'data/ninjago.json'
    json_file_path_star_wars = 'data/star-wars.json'
    json_file_path_marvel = 'data/marvel.json'
    json_file_path_duplo = 'data/friends.json'
    json_file_path_disney = 'data/disney.json'

    Products.objects.all().delete()

    load_products(json_file_path_age_1, "Lego 1+")
    load_products(json_file_path_age_4, "Lego 4+")
    load_products(json_file_path_age_18, "Lego 18+")
    load_products(json_file_path_ninjago, "Lego Ninjago")
    load_products(json_file_path_star_wars, "Lego Star-Wars")
    load_products(json_file_path_marvel, "Lego Marvel")
    load_products(json_file_path_duplo, "Lego Friends")
    load_products(json_file_path_disney, "Lego Disney")

    context = {
        'title': "Home - Главная",
        'content': 'Магазин мебели Home',
    }

    return render(request, 'main/index.html', context)


def get_image(pic_name, pic_url):
    if pic_url == 'Photo URL Missing':
        return "goods_images/Not found image.png"

    pic_url = pic_url.split('?')[0]
    response = requests.get(pic_url)

    if '.png' in pic_url:
        extension = '.png'
    else:
        extension = '.jpg'

    pic_name += extension

    if response.status_code == 200:
        try:
            with open(pic_name, 'wb') as file:
                file.write(response.content)
        except FileNotFoundError:
            pic_name = '/'.join(pic_name.split('/')[:-2]) + '/' + pic_name.split('/')[-1]
            with open(pic_name, 'wb') as file:
                file.write(response.content)
    else:
        print(f"Ошибка при скачивании изображения: {response.status_code}")

    pic_name = pic_name.split('media/')[-1]

    return pic_name


def load_products(file_path, category_name):
    with open(file_path, 'r') as json_file:
        data = json.load(json_file)

    category = Categories.objects.get(name=category_name)

    for item in data:
        if 'image' in item and 'name' in item and not Products.objects.filter(name=item['name']).exists():
            item['category'] = category
            item['image'] = get_image(f"media/goods_images/{'-'.join(item['name'].lower().split())}", item['image'])
            item['slug'] = ''
            for i in '-'.join(item['name'].lower().split()):
                if i.isalpha():
                    item['slug'] += i
                elif i == '-':
                    if len(item['slug']) > 0 and item['slug'][-1].isalpha():
                        item['slug'] += '-'
            item['slug'] = item['slug'].rstrip('-')

            item['description'] += f' Pieces: {item["pieces"]}'
            del item['pieces']

            obj = Products(**item)
            obj.save()
