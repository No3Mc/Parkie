from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, flash
import bcrypt
from bson.objectid import ObjectId
import secrets

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

@app.route('/', methods=['GET', 'POST'])
def index():
    if not session.get('logged_in'):
        return render_template('MngProfile.html', logged_in=False)
    else:
        user = users_collection.find_one({'_id': ObjectId(session['user_id'])})
        return render_template('MngProfile.html', user=user, logged_in=True)



@app.route('/MngProfile', methods=['GET', 'POST'])
def MngProfile():
    if request.method == 'POST':
        user_id = request.form['user_id']
        username = request.form['username']
        firsn = request.form['firsn']
        lasn = request.form['lasn']
        email = request.form['email']
        phone = request.form['phone']
        postcode = request.form['postcode']
        password = request.form['password']

        # update user data in the database
        users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'username': username,
                'firsn': firsn,
                'lasn': lasn,
                'email': email,
                'phone': phone,
                'postcode': postcode,
                'password': password
            }}
        )

        flash('User updated successfully!', 'success')
        return redirect(url_for('index'))

    else:
        user = users_collection.find_one({'_id': ObjectId(session['user_id'])})
        return render_template('MngProfile.html', user=user)




