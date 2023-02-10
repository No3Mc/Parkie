from django.shortcuts import render, redirect
from chatterbot import ChatBot
from chatterbot.ext.django_chatterbot import DjangoChatBot

# Create a new ChatBot instance
bot = ChatBot(
    'Django Helpbot',
    logic_adapters=[
        {
            'import_path': 'chatterbot.logic.BestMatch'
        },
        {
            'import_path': 'chatterbot.logic.LowConfidenceAdapter',
            'threshold': 0.70,
            'default_response': 'I am sorry, but I do not understand.'
        }
    ]
)

django_bot = DjangoChatBot(bot)

def chatbot(request):
    if request.method == 'POST':
        message = request.POST.get('message')
        response = django_bot.get_response(message)
        context = {
            'bot': django_bot,
            'response': response
        }
        return render(request, 'chatbot.html', context)
    else:
        context = {
            'bot': django_bot
        }
        return render(request, 'chatbot.html', context)
