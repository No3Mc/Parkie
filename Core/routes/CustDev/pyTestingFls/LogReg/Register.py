from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets
from flask import flash

# app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/LogReg')
app = Flask(__name__, static_url_path='', static_folder='static', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/LogReg')

app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

@app.route('/')
def index():
    return render_template('Register.html')

@app.route('/register', methods=['POST'])
def register():
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
        flash('Registration successful!', 'success')

    return redirect(url_for('index'))



if __name__ == '__main__':
    app.run(debug=True)
