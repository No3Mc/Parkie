from django.shortcuts import render
from django.http import HttpResponse

def bot_view(request):
    bot_response = None
    if request.method == 'POST':
        user_input = request.POST.get('user_input')
        bot_response = process_input(user_input)
    return render(request, 'bot/bot.html', {'bot_response': bot_response})


def process_input(user_input):
    # logic for processing the user's input here
    # For example:
    if user_input == "hi":
        return "Hello, how can I help you?"
    else:
        return "I'm sorry, I didn't understand your message."
