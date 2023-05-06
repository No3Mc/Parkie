import os
from django.shortcuts import render
from django.http import JsonResponse
from pymongo import MongoClient
import spacy

nlp = spacy.load("en_core_web_sm")

client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Chat_DB?retryWrites=true&w=majority')
db = client['Chat_DB']
responses = db['Chatbt']

def preprocess_message(message):
    if message:
        message = message.strip().lower()

        doc = nlp(message)
        tokens = [token.lemma_ for token in doc if not token.is_stop]

        message = " ".join(tokens)
    return message

def bot(request):
    template_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bot.html')

    if request.method == 'POST':
        message = request.POST.get('message')
        message = preprocess_message(message)
        response = responses.find_one({'message': message})
        if response:
            return JsonResponse({'response': response['message']})
        else:
            return JsonResponse({'response': 'Sorry, I do not understand your query.'})

    return render(request, template_path)

