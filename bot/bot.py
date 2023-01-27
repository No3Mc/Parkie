import re

# def generate_response(user_input):
#     response = "You said: " + user_input
#     return response


def help_bot(query):
    if re.search(r'help', query):
        return "I'm here to help! What do you need assistance with?"
    else:
        return "I'm sorry, I didn't understand your request. Please type 'help' if you need assistance."

query = input("What can I help you with? ")
print(help_bot(query))
