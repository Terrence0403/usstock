from langchain import FAISS
import pandas as pd
from langchain.embeddings import SentenceTransformerEmbeddings
import datetime
import os

json_path = os.getenv('JSON_PATH')

#import json file
data = pd.read_json(json_path)
data.head()
embedding_function = SentenceTransformerEmbeddings(model_name = 'all-MiniLM-L6-v2')

metadatas = []
for i,row in data.iterrows():
    metadatas.append({
        "title":row["title"],
        "date":row["date"],
        "company":row["company"],
    })

data["content"] = data["content"].astype(str)
faiss = FAISS.from_texts(data["content"].to_list(), embedding_function, metadatas)
# export faiss model
faiss.save_local("faiss_db","american-stock-fun")
print(f"{datetime.datetime.now()}: faiss model saved successfully!")