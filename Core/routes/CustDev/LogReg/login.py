from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import secrets
from flask import flash
import bcrypt
from time import sleep

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

# Set a delay of 5 seconds between login attempts
DELAY_SECONDS = 5

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/LogReg')
app.secret_key = secrets.token_hex(16)

@app.route('/')
def index():
    return render_template('login.html')


@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    user = users_collection.find_one({'email': email})

    if user and bcrypt.checkpw(password, user['password']):
        print('Login successful for user:', email)
        flash('Login successful!', 'success')
    else:
        print('Login failed for user:', email)
        flash('Invalid email or password', 'error')

        # Add a delay before returning to slow down brute force attacks
        sleep(DELAY_SECONDS)

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)

