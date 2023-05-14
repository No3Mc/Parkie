from pymongo import MongoClient
from gridfs import GridFS
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['profile']
def upload_image_to_db(image_path, collection):
    fs = GridFS(db)
    with open(image_path, 'rb') as image_file:
        file_id = fs.put(image_file)
    collection.insert_one({'image_id': file_id})
image_path = '/home/thr33/Downloads/pic.jpeg'
upload_image_to_db(image_path, users_collection)

