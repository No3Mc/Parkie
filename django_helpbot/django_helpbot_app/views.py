# django_helpbot_app/views.py
from django.http import HttpResponse

def chatbot(request):
    return HttpResponse("Hello, this is your chatbot!")

