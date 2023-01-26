from django.shortcuts import render
from .bot import generate_response
# Create your views here.

def bot_view(request):
    user_input = request.GET.get('user_input')
    response = generate_response(user_input)
    return render(request, 'bot.html', {'response': response})
