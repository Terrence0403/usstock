import os
import json
import datetime
from flask import Flask, render_template
from flask import request
from langchain.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import FAISS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key=os.getenv("API_KEY")

genai.configure(api_key=api_key)

def assistant(data):
    # load embedding model
    embedding_function = SentenceTransformerEmbeddings(model_name = 'all-MiniLM-L6-v2')
    prebuilt_faiss = FAISS.load_local(
        "faiss_db",
        embedding_function,
        "american-stock-fun",
        allow_dangerous_deserialization=True
    )
    model = genai.GenerativeModel("gemini-2.0-flash-exp",
        generation_config={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
    })
    # initialize chat 
    chat = model.start_chat(history=[])

    # set up the role description
    role_description = """
    You are a professional analyst specializing in the U.S. stock market.
 Your job is to analyze and summarize the most relevant information retrieved from the pre-trained vector database based on the user's question.
 If the user's question is about the U.S. stock market, please provide a concise response (less than 200 words).
 Includes relevant insights and recommendations (such as buy, sell, or hold).
 If the user's question is not related to the US stock market, strictly answer: "The question is not relevant to US stocks. Please try again."
 Do not provide any additional explanations or details on irrelevant issues.
If the user inputs a greeting, the reply is a greeting phrase "Hello, user",Please answer in Traditional Chinese.
    """
#     role_description = """
# You are a professional analyst specializing in the U.S. stock market.If the user's question is about the U.S. stock market, please provide a concise response (less than 200 words),use tranditional chineese.
# """
        # get user input
    user_input = data
    print(user_input)
    if not user_input:
        return render_template("index.html", response="Please enter a valid question.")
   
    # set up the response
    embedding_results = []

    # update the response based on the user input
    to_llm = ""
    try:
        # embedding search
        embedding_results = prebuilt_faiss.similarity_search_with_score(user_input+f"{datetime.datime.now()}", k=5)
        if not embedding_results:
            raise ValueError("No relevant results found in the vector database.")
        print(embedding_results)
        # retrieve the relevant information
        retrieved_info = "\n".join(
            f"Title: {doc.metadata['title']}\nContent: {doc.page_content}\nScore: {score}"
            for doc, score in embedding_results
        )
        # retrieved_info = "\n".join("")
        to_llm = f"{role_description}\nUser's question: {user_input}\nRetrieved information:\n{retrieved_info}"

    except Exception as e:
        print(f"Error during similarity search: {e}")
        return render_template("index.html", response="I'm sorry, but I couldn't find relevant information.")

    # generate the response
    try:
        result = chat.send_message(to_llm)
        print(result)
        result_text = {"text": result.text.replace("\n", "")}
        
    except Exception as e:
        print(f"Error during LLM response generation: {e}")
        result_text = "I couldn't process your request due to an error."
    response = json.dumps(result_text,indent=4)
    print(response)
    return response