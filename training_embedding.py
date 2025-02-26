import os
import json
import datetime
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

load_dotenv()

JSON_PATH = os.getenv('JSON_PATH')
# JSON_PATH = "C:\\Users\\USER\\Desktop\\team_project\\usstock\\data\\output.json"

# connecting to mongodb
uri = "mongodb+srv://american-stock.w9ior.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=American-stock"
path = os.getenv('MONGO_CERT_PATH')
# path = "C:\\Users\\USER\\Desktop\\team_project\\usstock\\scrap_cert.pem"
client = MongoClient(uri,
                     tls=True,
                     tlsCertificateKeyFile=path,
                     server_api=ServerApi('1'))

# set db table and collection
db = client["project_data"]
collection = db["stock_data"]

doc_count_all = collection.count_documents({})
print(f"{datetime.datetime.now()}:Total Documents: {doc_count_all}")

# select all documents
file = collection.find({})
results = []
for doc in file:
    doc.pop('_id', None)  
    results.append(doc)

# save data to json
content_json = json.dumps(results, indent=4,default=str)
with open(JSON_PATH, "w", encoding="utf-8") as f:
    f.write(content_json)

print(f"{datetime.datetime.now()}:Data saved successfully! Total documents: {doc_count_all}")
