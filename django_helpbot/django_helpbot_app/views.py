import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def chatbot(request):
    if request.method == 'POST':
        message = json.loads(request.body)['message']
        response = process_message(message)
        return JsonResponse({'message': response})

    return JsonResponse({'message': 'Please send a POST request with a message.'})


def process_message(message):
    # Add your chatbot logic here to generate a response based on the message
    # For example, you can use a pre-trained model or a rule-based system
    # For simplicity, we'll just echo the user's message back
    return f"You said: {message}"
