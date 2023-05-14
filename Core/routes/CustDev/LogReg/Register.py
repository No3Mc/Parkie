from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets
from flask import flash
from flask_mail import Mail, Message
import os
import bcrypt

app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev', static_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/static')

app.secret_key = secrets.token_hex(16)

# Configure Flask-Mail settings
app.config['MAIL_SERVER']='smtp.aol.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True


# def email
app.config['MAIL_DEFAULT_SENDER'] = 'help.almadad@aol.com'

# Create a Mail instance
mail = Mail(app)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

@app.route('/')
def index():
    return render_template('layout/header.html')
    # return render_template('layout/header.html')

@app.route('/rpg')
def rpg():
    return render_template('LogReg/Register.html')
    # return render_template('LogReg/Register.html')


@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    firsn = request.form['firsn']
    lasn = request.form['lasn']
    email = request.form['email']
    phone = request.form['phone']
    postcode = request.form['postcode']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    # hash password using bcrypt
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    # check if user already exists
    if users_collection.find_one({'email': email}):
        flash('User with this email already exists', 'error')
    else:
        # generate a random token for email verification
        token = secrets.token_hex(16)
        # insert user into database with unverified email and token
        user_data = {
            'username': username,
            'firsn': firsn,
            'lasn': lasn,
            'email': email,
            'phone': phone,
            'postcode': postcode,
            'password': hashed_password,  # store hashed password in database
            'verified': False,
            'token': token
        }
        users_collection.insert_one(user_data)

        # remove the original password from the dictionary
        del user_data['password']

        flash('Registration successful! Please check your email to verify your account', 'success')
        # send verification email
        verify_url = url_for('verify', token=token, _external=True)
        msg = Message('Verify your email', sender=app.config['MAIL_USERNAME'], recipients=[email])
        msg.body = f'Please click the following link to verify your email: {verify_url}'
        mail.send(msg)

    return redirect(url_for('index'))


@app.route('/verify/<token>')
def verify(token):
    # check if token is valid
    user = users_collection.find_one({'token': token})
    if not user:
        flash('Invalid token', 'error')
    else:
        # update user to verified email and remove token
        users_collection.update_one({'_id': user['_id']}, {'$set': {'verified': True}, '$unset': {'token': 1}})
        flash('Email verified! You can now log in', 'success')

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5001)

