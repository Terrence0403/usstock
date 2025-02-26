import os
import random
from datetime import datetime, timedelta
from urllib.error import HTTPError
import requests
import time as t

import bs4
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import pymongo

# connecting to mongodb
uri = "mongodb+srv://american-stock.w9ior.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=American-stock"
path = os.getenv('MONGO_CERT_PATH')

client = MongoClient(uri,
                     tls=True,
                     tlsCertificateKeyFile=path,
                     server_api=ServerApi('1'))

db = client['project_data']
collection = db['stock_data']
doc_count = collection.count_documents({})
print(f"{datetime.now()}: Total News:{doc_count}")


# random sleep time
random_sleep_time = random.uniform(0.5, 1)

# setting up scraping configurations
today = datetime.today().strftime('%Y-%m-%d')
yesterday = (datetime.now() - timedelta(1)).strftime('%Y-%m-%d')

year = int(today.split('-')[0])
mon = int(today.split('-')[1])
day = int(today.split('-')[2])
date = datetime(year, mon, day, 6, 0, 0)

# check if data is already in the database
x = collection.find().sort("date", pymongo.DESCENDING)

data_exists = False

for i in x:
    if i['date'] == date:
        data_exists == False
    else:
        data_exists == True

if data_exists:
    print('Data already exists in the database')
else:
    h = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
        "Referer": "https://www.google.com/"
    }

    articles = []
    save = "finance.yahoo.com/news/"

    companies= ["AAPL", "MSFT", "NVDA", "GOOG", "AMZN", "META", "BRK.B", "LLY", "AVGO", "TSLA"]

    for i in companies:
        company = i

        url = f'https://finance.yahoo.com/quote/{company}/news/'
        try:
            response = requests.get(url, headers=h)
        except HTTPError:
            print('no news found or server error')

        html = bs4.BeautifulSoup(response.text)
        links = html.find_all('a')
        for i in links:
            href = i.get('href')
            if href:
                if save in str(href):
                    articles.append(href)

        # remove repeated links
        articles = list(set(articles))

        # remove links without content
        articles = [i for i in articles if len(i.split('/')[-1]) > 1]

        t.sleep(random_sleep_time)
        for i in articles:
            temp_table = {
                'company': [],
                'title': [],
                'content': [],
                'date': []
            }

            url = i
            content_out = []

            response = requests.get(url, headers=h)
            html = bs4.BeautifulSoup(response.text)
            title = html.find('title').text
            time = html.find('time')['data-timestamp'].split('T')[0]
            content = html.find_all('p')

            # getting yesterday's data due to timezone difference
            if time == yesterday:
                for c in content:
                    if "Sign in to access your portfolio" not in c.text:
                        content_out.append(c.text)
                    else:
                        break
                if len(content_out) != 1:
                    temp_table['date'] = date
                    temp_table['company'] = company
                    temp_table['title'] = title
                    temp_table['content'].append(content_out)
                    
                    if not collection.find_one({"title": title}):
                        x = collection.insert_one(temp_table)
            t.sleep(random_sleep_time)
        t.sleep(random_sleep_time)

print(f"{datetime.now()}: Data NEWS update:{doc_count}")
