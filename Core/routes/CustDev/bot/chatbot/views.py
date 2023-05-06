import os
from django.shortcuts import render
from django.http import JsonResponse
from pymongo import MongoClient
import spacy
import re

nlp = spacy.load("en_core_web_sm")

# Connect to MongoDB database
try:
    client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Chat_DB?retryWrites=true&w=majority')
    db = client['Chat_DB']
    responses = db['Chatbt']
except Exception as e:
    print("Error connecting to database:", e)
    responses = None

def preprocess_message(message):
    if message:
        message = message.strip().lower()
        print("Lowercase message:", message)

        doc = nlp(message)
        tokens = [token.lemma_ for token in doc if not token.is_stop]
        print("Tokenized message:", tokens)

        message = " ".join(tokens)
        message = message.strip()
        print("Final processed message:", message)
    return message

def bot(request):
    template_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bot.html')

    if request.method == 'POST':
        message = request.POST.get('message')
        message = preprocess_message(message)

        print("Preprocessed message:", message)

        if not message:
            return JsonResponse({'response': 'Please enter a valid query.'})

        print("MongoDB collection:", responses)

        regex = re.compile(f'.*{message}.*', re.IGNORECASE)
        response = responses.find_one({'message': {'$regex': regex}})

        print("MongoDB response:", response)

        if response:
            return JsonResponse({'response': response['message']})
        else:
            return JsonResponse({'response': 'Sorry, I do not understand your query.'})

    return render(request, template_path)
