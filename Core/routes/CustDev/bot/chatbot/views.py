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
    try:
        message = request.GET.get('message')

        message = preprocess_message(message)

        response = responses.find_one({'message': message})

        if response:
            return JsonResponse({'response': response['response']})
        else:
            return JsonResponse({'response': 'Sorry, I do not understand your query.'})

    except Exception as e:
        return JsonResponse({'response': f"Error: {str(e)}"})

