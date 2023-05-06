from pymongo import MongoClient

client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Chat_DB?retryWrites=true&w=majority')
db = client['Chat_DB']
responses = db['Chatbt']

for doc in responses.find():
    print(doc)

