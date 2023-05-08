# MngPromos.py
from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, flash
from bson.objectid import ObjectId
from datetime import datetime, time

import secrets

# app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/Manage')
app = Flask(__name__, static_url_path='', static_folder='static', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/Manage')
app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['PROMO_DB']
promos_collection = db['promos']

@app.route('/')
def index():
    promos = list(promos_collection.find())
    return render_template('MngPromos.html', promos=promos)

@app.route('/add-promo', methods=['POST'])
def add_promo():
    promo_code = request.form['promo-code']
    discount = int(request.form['discount'])
    expiry_date = datetime.combine(datetime.strptime(request.form['expiry-date'], '%Y-%m-%d'), time.min)

    # check if promo code already exists
    if promos_collection.find_one({'promo-code': promo_code}):
        flash('Promo code already exists', 'error')
    else:
        # insert promo into database
        promo_data = {
            'promo-code': promo_code,
            'discount': discount,
            'expiry-date': expiry_date
        }
        promos_collection.insert_one(promo_data)
        flash('Promotion added successfully!', 'success')

    return redirect(url_for('index'))


@app.route('/delete-promo/<string:promo_id>', methods=['POST'])
def delete_promo(promo_id):
    promos_collection.delete_one({'_id': ObjectId(promo_id)})
    flash('Promotion deleted successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/edit-promo/<string:promo_id>', methods=['GET', 'POST'])
def edit_promo(promo_id):
    promo = promos_collection.find_one({'_id': ObjectId(promo_id)})
    if request.method == 'GET':
        return render_template('MngPromos.html', promos=[promo], edit_mode=True)
    elif request.method == 'POST':
        promo_code = request.form['promo-code']
        discount = int(request.form['discount'])
        expiry_date = datetime.strptime(request.form['expiry-date'], '%Y-%m-%d').date()

        # update promo data in the database
        promos_collection.update_one(
            {'_id': ObjectId(promo_id)},
            {'$set': {
                'promo-code': promo_code,
                'discount': discount,
                'expiry-date': datetime.combine(datetime.strptime(request.form['expiry-date'], '%Y-%m-%d'), time())
            }}
        )

        flash('Promotion updated successfully!', 'success')
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5005)
