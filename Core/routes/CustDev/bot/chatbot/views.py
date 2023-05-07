import os
from django.shortcuts import render
from django.http import JsonResponse
from pymongo import MongoClient
import spacy
import re
import random
from datetime import datetime
import string
import random

nlp = spacy.load("en_core_web_sm")

# Connect to MongoDB database
try:
    client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Chat_DB?retryWrites=true&w=majority')
    db = client['Chat_DB']
    chats = db['Chats']
    responses = db['Chatbt']
except Exception as e:
    print("Error connecting to database:", e)
    responses = None

def preprocess_message(message):
    if message:
        message = message.strip().lower()

        doc = nlp(message)
        tokens = [token.lemma_ for token in doc if not token.is_stop]

        message = " ".join(tokens)
        message = message.strip()
    return message

def generate_random_string(length=6):
    letters = string.ascii_lowercase
    random_string = ''.join(random.choice(letters) for i in range(length))
    print("Random string:", random_string)
    return random_string


def generate_response(message, return_all=False):
    if not message:
        return 'Please enter a valid query.'

    question_fields = [f'Question{i}' for i in range(1, 100)]

    question_regex = re.compile(fr'{message}', re.IGNORECASE)
    response_docs = responses.find({'$or': [{field: {'$regex': question_regex}} for field in question_fields]})

    matching_responses = []
    for response_doc in response_docs:
        message_count = 1
        while f'message{message_count}' in response_doc:
            matching_responses.append(response_doc[f'message{message_count}'])
            message_count += 1

    if matching_responses:
        if return_all:
            return matching_responses
        else:
            response = random.choice(matching_responses)
            return response
    else:
        return 'Sorry, I do not understand your query.'

def bot(request):
    template_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bot.html')

    if request.method == 'POST':
        message = request.POST.get('message')
        message = preprocess_message(message)
        response = generate_response(message)

        print("Input message:", message)
        print("Bot response:", response)

        # Save the conversation to the database
        chat_history = db['Chats']
        chat_doc = chat_history.find_one({'user_id': 'user_id'})
        if not chat_doc:
            chat_doc = {'user_id': 'user_id', 'conversations': []}

        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        conversation = {'timestamp': timestamp, 'user_message': message, 'bot_response': response}
        chat_doc['conversations'].append(conversation)
        chat_history.save(chat_doc)

        return JsonResponse({'response': response})

    return render(request, template_path)
