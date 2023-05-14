from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, flash
import secrets
import bcrypt
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from flask import jsonify


# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

app = Flask(__name__, static_url_path='', static_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/layout', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev')
app.secret_key = secrets.token_hex(16)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'


# Rate limiting for failed login attempts
failed_logins = {}


class User(UserMixin):
    def __init__(self, user_dict):
        self.id = str(user_dict['_id'])
        self.username = user_dict['username']
        # Add any other required attributes

    def is_active(self):
        return True  


@login_manager.user_loader
def load_user(user_id):
    user_dict = users_collection.find_one({'_id': ObjectId(user_id)})
    if user_dict:
        return User(user_dict)
    return None


def rate_limited(ip_address):
    now = datetime.now()
    if ip_address in failed_logins:
        attempts, last_attempt_time = failed_logins[ip_address]
        if now - last_attempt_time > timedelta(minutes=10):
            # Reset failed login attempts after 10 minutes
            failed_logins[ip_address] = (0, now)
            return False
        elif attempts >= 5:
            # Limit failed login attempts to 5 per 10-minute window
            return True
        else:
            failed_logins[ip_address] = (attempts + 1, last_attempt_time)
            return False
    else:
        failed_logins[ip_address] = (1, now)
        return False


@app.route('/')
def index():
    return render_template('layout/header.html')


@app.route('/login', methods=['POST'])
def login():
    ip_address = request.remote_addr
    if rate_limited(ip_address):
        flash('Too many failed login attempts. Please try again later.', 'error')
        return redirect(url_for('index'))

    username = request.form['username']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    user = users_collection.find_one({'username': username})

    if user and bcrypt.checkpw(password, user['password']):
        print('Login successful for user:', username)
        login_user(User(user))
        return jsonify({'message': 'Login successful'}), 200
    else:
        print('Login failed for user:', username)
        return jsonify({'message': 'Login failed'}), 401

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, port=5002)

