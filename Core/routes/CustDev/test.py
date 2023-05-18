from pymongo import MongoClient
import os
# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')

user_db = client['USER_DB']
user_collection = user_db['users']

admin_db = client['Admin_DB']
admin_collection = admin_db['admins']

guest_db = client['USER_DB']
guest_collection = guest_db['guests']

paths = client['USER_DB']
collection = paths['paths']

static_dir = os.getcwd()
static_dir = os.path.join(static_dir, "static")

temp_dir = os.path.dirname(os.path.dirname(static_dir))

data = {
    'static_dir': static_dir,
    'temp_dir': temp_dir
}

collection.insert_one(data)









