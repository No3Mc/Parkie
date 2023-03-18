from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets
from flask import flash
from bson.objectid import ObjectId

app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/Manage')
app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

@app.route('/MngCusts')
def MngCusts():
    users = users_collection.find()
    return render_template('MngCusts.html', users=users)

@app.route('/edit/<string:user_id>', methods=['GET', 'POST'])
def edit(user_id):
    user = users_collection.find_one({'_id': ObjectId(user_id)})
    if request.method == 'POST':
        username = request.form['username']
        firsn = request.form['firsn']
        lasn = request.form['lasn']
        email = request.form['email']
        phone = request.form['phone']
        postcode = request.form['postcode']
        password = request.form['password']

        users_collection.update_one({'_id': ObjectId(user_id)}, {'$set': {'username': username, 'firsn': firsn, 'lasn': lasn, 'email': email, 'phone': phone, 'postcode': postcode, 'password': password}})
        flash('User updated successfully!', 'success')
        return redirect(url_for('MngCusts'))

    return render_template('edit.html', user=user)

@app.route('/add', methods=['GET', 'POST'])
def add():
    if request.method == 'POST':
        username = request.form['username']
        firsn = request.form['firsn']
        lasn = request.form['lasn']
        email = request.form['email']
        phone = request.form['phone']
        postcode = request.form['postcode']
        password = request.form['password']

        # check if user already exists
        if users_collection.find_one({'email': email}):
            flash('User with this email already exists', 'error')
        else:
            # insert user into database
            user_data = {
                'username': username,
                'firsn': firsn,
                'lasn': lasn,
                'email': email,
                'phone': phone,
                'postcode': postcode,
                'password': password
            }
            users_collection.insert_one(user_data)
            flash('User added successfully!', 'success')
            return redirect(url_for('MngCusts'))

    return render_template('add.html')

@app.route('/delete/<string:user_id>', methods=['POST'])
def delete(user_id):
    users_collection.delete_one({'_id': ObjectId(user_id)})
    flash('User deleted successfully!', 'success')
    return redirect(url_for('MngCusts'))

if __name__ == '__main__':
    app.run(debug=True)
