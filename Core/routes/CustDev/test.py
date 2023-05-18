import os
from pymongo import MongoClient

client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')


paths = client['USER_DB']

collection = paths['paths']

static_dir = os.getcwd()
static_dir = os.path.join(static_dir, "static")

temp_dir = os.path.dirname(os.path.dirname(static_dir))

# Delete previous documents
collection.delete_many({})

data = {
    'static_dir': static_dir,
    'temp_dir': temp_dir
}

collection.insert_one(data)


