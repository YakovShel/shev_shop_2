# file for Yakov's parser
import asyncio
import aiohttp
from bs4 import BeautifulSoup
import aiofiles
import json
import os
import random
import pandas as pd


async def fetch(url, session):
    # print(f"Fetching {url}")
    async with session.get(url) as response:
        return await response.text()


def usd_to_rub(price, course):
    return str(int(course * float(price.split("$")[1])))


def find_course():
    url = "https://www.fontanka.ru/currency.html"
    df = pd.read_html(url)[0]
    usd_rate = df.loc[df['Валюта'] == 'usd', 'Курс'].iloc[0]
    return float(usd_rate)


async def get_total_pages(url, session):
    html = await fetch(url, session)
    soup = BeautifulSoup(html, "lxml")
    try:
        text = soup.find("div", class_="Pagination_paginationContainer__tXJvB").text.split()
        offset = int(text[1])
        total = int(text[3])
        count_of_pages = ((total + offset - 1) // offset)
        # print(f"Total pages for {url}: {count_of_pages}")
        return count_of_pages

    except:
        return 1


async def get_product_data(product_url, session, product_info, course):
    try:
        html = await fetch(product_url, session)
        soup = BeautifulSoup(html, "lxml")

        name = soup.find("h1",
                         class_="Text__BaseText-sc-13i1y3k-0 dKHUnY ProductOverviewstyles__NameText-sc-1a1az6h-8 gEIZRA").find(
            "span", class_="Markup__StyledMarkup-nc8x20-0 epIXnJ").text

        photo = soup.find("source", type="image/webp").get("srcset").split()[0]

        try:
            description = soup.find("div", class_="ProductFeaturesstyles__FeaturesText-tutz3a-2 fzZZpn").find("span",
                                                                                                              class_="Markup__StyledMarkup-nc8x20-0 epIXnJ").text
        except:
            try:
                description = soup.find("div",
                                        class_="TextBlock_bodyLight__Z2IVc TextBlock_center__Ycx9Z ds-body-md-regular").find(
                    "span", class_="markup").text
            except:
                description = ""

        product_info.update({"name": name, "image": photo, "description": description})
        return product_info

    except AttributeError as e:
        product_info.update({"Name": "Product Name Missing", "image": "Photo URL Missing",
                             "Description": "Product Description Missing"})
        return product_info


async def get_page_data(url, session, data_json):
    course = find_course()
    try:
        html = await fetch(url, session)
        soup = BeautifulSoup(html, "lxml")
        articles = soup.find_all("article", class_="ProductLeaf_wrapper__H0TCb")

        tasks = []
        for article in articles:
            product_url = "https://www.lego.com" + article.find("a",
                                                                class_="ProductImage_productLink__G_6o_ ProductImage_prevButtonHidden__LfB7l ProductImage_displayScrollbar__wQ6aL scrollbarHorizontalLight").get(
                "href")
            price_element = article.find('div', {'data-test': 'product-leaf-price-row'})
            price = price_element.get('aria-label') if price_element else "0"
            try:
                real_price = article.find('span',
                                          class_='price-sm-bold ProductLeaf_crossedOutPrice__P06gk ProductLeaf_price__18ucA').text
            except:
                real_price = "$0.00"

            price = usd_to_rub(price, course)
            real_price = usd_to_rub(real_price, course)

            pieces_element = article.find('span', {'data-test': 'product-leaf-piece-count-label'})
            pieces = pieces_element.text if pieces_element else "Pieces Missing"

            if int(real_price) == 0:
                discount = 0.00
            else:
                discount = round((int(real_price) - int(price)) / int(real_price) * 100)
                price = real_price

            product_info = {"slug": product_url, "price": price, "discount": discount, "category": "", "pieces": pieces, "quantity": random.randint(1000, 5000)}
            task = asyncio.create_task(get_product_data(product_url, session, product_info, course))
            tasks.append(task)

        for task in tasks:
            product_data = await task
            data_json.append(product_data)

    except Exception as e:
        print(f"Error processing page {url}: {e}")


async def write_json(data, filename):
    async with aiofiles.open(filename, 'w', encoding='utf-8') as file:
        await file.write(json.dumps(data, indent=4, ensure_ascii=False))


async def process_category(url, session):
    page_name = url.split("/")[-1]
    filename = f"data/{page_name}.json"
    data_json = []

    count_of_pages = await get_total_pages(url, session)
    for i in range(1, count_of_pages + 1):
        await get_page_data(f"{url}?page={i}", session, data_json)

    await write_json(data_json, filename)
    print(filename)


async def main():
    if not os.path.exists("data"):
        os.mkdir("data")

    categories_urls = [
        "https://www.lego.com/en-sg/categories/age-1-plus-years",
        "https://www.lego.com/en-sg/categories/age-4-plus-years",
        "https://www.lego.com/en-sg/categories/age-18-plus-years",
        "https://www.lego.com/en-sg/themes/disney",
        "https://www.lego.com/en-us/themes/friends",
        "https://www.lego.com/en-sg/themes/marvel",
        "https://www.lego.com/en-sg/themes/ninjago",
        "https://www.lego.com/en-sg/themes/star-wars"
    ]
    data_json = []

    async with aiohttp.ClientSession() as session:
        category_tasks = [process_category(url, session) for url in categories_urls]
        await asyncio.gather(*category_tasks)


if __name__ == "__main__":
    asyncio.run(main())
