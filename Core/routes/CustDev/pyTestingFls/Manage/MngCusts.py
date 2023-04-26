from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets
from bson.objectid import ObjectId
from flask import flash

# app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/Manage')
app = Flask(__name__, static_url_path='', static_folder='static', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/Manage')
app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

@app.route('/')
def index():
    users = users_collection.find()
    return render_template('MngCusts.html', users=users)

@app.route('/edit_user', methods=['GET', 'POST'])
def edit_user():
    if request.method == 'GET':
        user_id = request.args.get('user_id')
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        return render_template('MngCusts.html', user=user, edit_mode=True)

    elif request.method == 'POST':
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

@app.route('/delete_user', methods=['POST'])
def delete_user():
    user_id = request.form['user_id']
    users_collection.delete_one({'_id': ObjectId(user_id)})
    flash('User deleted successfully!', 'success')
    return redirect(url_for('index'))



if __name__ == '__main__':
    app.run(debug=True)
