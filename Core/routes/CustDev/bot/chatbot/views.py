import os
from django.shortcuts import render
from django.http import JsonResponse
from pymongo import MongoClient
from django.contrib import messages
from django.shortcuts import redirect
import spacy
import re
import random
from datetime import datetime
import string
import random
import uuid

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
        # Check if user entered email and password
        message = request.POST.get('message')
        message = preprocess_message(message)

        if message.startswith('/admin'):
            email_password = message[7:].split()
            if len(email_password) == 2:
                email, password = email_password
                admin_doc = db['Admins'].find_one({'email': email, 'password': password})

                if admin_doc:
                    response = 'Welcome Admin! What can I help you with?'
                else:
                    response = 'Sorry, I could not validate your credentials. Please try again.'
            else:
                response = 'Please enter valid email and password in the format: /admin email pass'
        else:
            # Process the user message and generate a bot response
            response = generate_response(message)

            if not response:
                response = 'Sorry, I do not understand your query.'

        print("Input message:", message)
        print("Bot response:", response)

        # Save the conversation to the database
        chat_history = db['Chats']
        user_id = request.session.get('session_key')
        if not user_id:
            user_id = str(uuid.uuid4())
            request.session['session_key'] = user_id
            conversation_id = str(uuid.uuid4())
            conversation_history = []
            chat_doc = {'id': conversation_id, 'user_id': user_id, 'conversation': conversation_history}
            chat_history.insert_one(chat_doc)
        else:
            conversation = chat_history.find_one({'user_id': user_id})
            if conversation:
                conversation_id = conversation['id']
                conversation_history = conversation['conversation']
            else:
                conversation_id = str(uuid.uuid4())
                conversation_history = []
                chat_doc = {'id': conversation_id, 'user_id': user_id, 'conversation': conversation_history}
                chat_history.insert_one(chat_doc)

        conversation_history.append({'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'user_message': message, 'bot_response': response})
        chat_history.update_one(
            {'id': conversation_id},
            {'$set': {'conversation': conversation_history}}
        )

        return JsonResponse({'id': conversation_id, 'response': response})

    else:
        # agar page refresh ho ke de ga to ye new document bana ke de ga aur us main convo store kar ke dega 
        chat_history = db['Chats']
        user_id = str(uuid.uuid4())
        request.session['session_key'] = user_id
        conversation_id = str(uuid.uuid4())
        conversation_history = []
        chat_doc = {'id': conversation_id, 'user_id': user_id, 'conversation': conversation_history}
        chat_history.insert_one(chat_doc)

        return render(request, template_path)

