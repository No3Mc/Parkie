from pymongo import MongoClient
from flask import Flask, render_template, request

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/AbtPro')

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['PROMO_DB']
promos_collection = db['promos']

@app.route('/')
def index():
    promos = list(promos_collection.find())
    return render_template('Promos.html', promos=promos)

@app.route('/delete-promo', methods=['POST'])
def delete_promo():
    promo_code = request.json['promoCode']
    result = promos_collection.delete_one({'promo-code': promo_code})
    if result.deleted_count == 1:
        return 'Promo deleted successfully', 200
    else:
        return 'Failed to delete promo', 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

