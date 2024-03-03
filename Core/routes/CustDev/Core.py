from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import secrets
import bcrypt
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin
from datetime import datetime, timedelta, timezone
from bson.objectid import ObjectId
from flask_mail import Mail, Message
import os
import re
from werkzeug.utils import secure_filename
from google.cloud import storage
from Manage.MngPromos import add_promo, delete_promo, edit_promo, promos_collection
from Manage.MngCusts import edit_user_route, delete_user_route
from VulFaq.VulRep import index as vulrep_index, vulnerability_report as vulrep_vulnerability_report
from flask_login import logout_user

#Blowfish symmetric key block cipher

template_folder_path = '/home/thr33/Downloads/Parkie/Core'
static_folder_path = '/home/thr33/Downloads/Parkie/Core/routes/CustDev/static'



# Define paths for template and static files
# template_folder_path = 'F:\Parkie/Core'
# static_folder_path = 'F:\Parkie/Core/routes/CustDev/static'

headerpth = 'routes/CustDev/layout/header.html'
footerpth = 'routes/CustDev/layout/footer.html'
loginpth = 'routes/CustDev/layout/login.html'

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')

# Define database and collection objects
user_db = client['USER_DB']
user_collection = user_db['users']

admin_db = client['Admin_DB']
admin_collection = admin_db['admins']

guest_db = client['USER_DB']
guest_collection = guest_db['guests']

# Initialize Flask application
app = Flask(__name__, template_folder=template_folder_path, static_folder=static_folder_path)

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
app.secret_key = secrets.token_hex(16)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'

# Rate limiting for failed login attempts
failed_logins = {}


# User class representing a regular user
class User(UserMixin):
    def __init__(self, user_dict):
        self.id = str(user_dict['_id'])
        self.username = user_dict['username']
        self.profile_icon_url = user_dict.get('profile_icon_url')

    def is_active(self):
        return True

    def set_profile_icon_url(self, profile_icon_url):
        self.profile_icon_url = profile_icon_url


# Guest class representing a guest user
class Guest(UserMixin):
    def __init__(self, guest_dict):
        self.id = str(guest_dict['_id'])
        self.username = guest_dict['username']
        self.profile_icon_url = guest_dict.get('profile_icon_url')
        self.is_admin = False

    def is_active(self):
        return True

    def set_profile_icon_url(self, profile_icon_url):
        self.profile_icon_url = profile_icon_url


# Admin class representing an administrator user
class Admin(UserMixin):
    def __init__(self, user_dict):
        self.id = str(user_dict['_id'])
        self.username = user_dict['username']
        self.profile_icon_url = user_dict.get('profile_icon_url')

    def is_active(self):
        return True

    def set_profile_icon_url(self, profile_icon_url):
        self.profile_icon_url = profile_icon_url


@app.context_processor
def inject_user():
    return dict(current_user=current_user)


@login_manager.user_loader
def load_user(user_id):
    user_dict = user_collection.find_one({'_id': ObjectId(user_id)})
    if user_dict:
        return User(user_dict)

    admin_dict = admin_collection.find_one({'_id': ObjectId(user_id)})
    if admin_dict:
        admin_user = User(admin_dict)
        admin_user.is_admin = True
        return admin_user

    guest_dict = guest_collection.find_one({'_id': ObjectId(user_id)})
    if guest_dict:
        return Guest(guest_dict)

    return None


def rate_limited(ip_address):
    now = datetime.now()
    if ip_address in failed_logins:
        attempts, last_attempt_time = failed_logins[ip_address]
        if now - last_attempt_time > timedelta(minutes=10):
            failed_logins[ip_address] = (0, now)
            return False
        elif attempts >= 5:
            return True
        else:
            failed_logins[ip_address] = (attempts + 1, last_attempt_time)
            return False
    else:
        failed_logins[ip_address] = (1, now)
        return False


@app.route('/')
def index():
    return render_template('index.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/main')
@login_required
def main():
    return render_template('routes/ParkDev/parking/main.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/lend')
def lend():
    return render_template('routes/ClientDev/Lend.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/future')
def future():
    return render_template('future.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/howto')
def howto():
    return render_template('routes/ParkDev/Howitworks/How.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/add-promo', methods=['POST'])
def add_promo_route():
    return add_promo()


@app.route('/delete-promo/<string:promo_id>', methods=['POST'])
def delete_promo_route(promo_id):
    return delete_promo(promo_id)


@app.route('/edit-promo/<string:promo_id>', methods=['GET', 'POST'])
def edit_promo_route(promo_id):
    return edit_promo(promo_id)

@app.route('/edit_user', methods=['GET', 'POST'])
def edit_user():
    return edit_user_route()

@app.route('/delete_user', methods=['POST'])
def delete_user():
    return delete_user_route()


@app.route('/admin_dashboard')
@login_required
def admin_dashboard():
    return render_template('routes/CustDev/Dashboards/ADashboard.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/dashboard')
def dashboard():
    return render_template('routes/CustDev/Dashboards/CDashboard.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/MngCusts')
def MngCusts():
    users = user_collection.find()
    return render_template('routes/CustDev/Manage/MngCusts.html',header=headerpth, footer=footerpth, users=users)


@app.route('/MngProfile', methods=['GET', 'POST'])
@login_required
def MngProfile():
    if request.method == 'POST':
        user_id = current_user.id
        username = request.form['username']
        firsn = request.form['firsn']
        lasn = request.form['lasn']
        email = request.form['email']
        phone = request.form['phone']
        postcode = request.form['postcode']
        password = request.form['password'].encode('utf-8')

        # update user data in the database
        user_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'username': username,
                'firsn': firsn,
                'lasn': lasn,
                'email': email,
                'phone': phone,
                'postcode': postcode,
                'password': bcrypt.hashpw(password, bcrypt.gensalt())
            }}
        )

        flash('User updated successfully!', 'success')
        return redirect(url_for('MngProfile'))

    else:
        user = user_collection.find_one({'_id': ObjectId(current_user.id)})
        return render_template('routes/CustDev/Manage/MngProfile.html', header=headerpth, footer=footerpth, login=loginpth, user=user)


@app.route('/MngPromos')
def MngPromos():
    promos = promos_collection.find()
    return render_template('routes/CustDev/Manage/MngPromos.html', promos=promos)


@app.route('/help')
def help():
    return render_template('routes/CustDev/VulFaq/DocnFAQ.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/AboutUs')
def AboutUs():
    return render_template('routes/CustDev/AbtPro/AboutUs.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/rpg')
def rpg():
    return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, login=loginpth)

@app.route('/lendfm')
@login_required
def lendfm():
    return render_template('routes/ClientDev/frame.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/history')
def history():
    return redirect('http://localhost:3000/histroy.html')


@app.route('/contact')
def multan():
    return render_template('routes/CustDev/VulFaq/VulRep.html', header=headerpth, footer=footerpth, login=loginpth)


@app.route('/login', methods=['POST'])
def login():
    ip_address = request.remote_addr
    if rate_limited(ip_address):
        flash('Too many failed login attempts. Please try again later.', 'error')
        return redirect(url_for('index'))

    username = request.form['username']
    password = request.form['password']

    user = user_collection.find_one({'username': username})
    admin = admin_collection.find_one({'username': username})
    guest = guest_collection.find_one({'username': username})  # Check guest collection

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        print('Login successful for user:', username)
        user_obj = User(user)
        profile_icon_url = user.get('profile_icon_url')
        if profile_icon_url:
            user_obj.set_profile_icon_url(profile_icon_url)
        login_user(user_obj)
        # Set the profile icon URL in the current_user object
        current_user.set_profile_icon_url(profile_icon_url)
        return redirect(url_for('index'))
    elif admin and bcrypt.checkpw(password.encode('utf-8'), admin['password'].encode('utf-8')):
        print('Login successful for admin:', username)
        admin_obj = User(admin)
        profile_icon_url = admin.get('profile_icon_url')
        if profile_icon_url:
            admin_obj.set_profile_icon_url(profile_icon_url)
        admin_obj.is_admin = True
        login_user(admin_obj)
        # Set the profile icon URL in the current_user object
        current_user.set_profile_icon_url(profile_icon_url)
        return redirect(url_for('index'))

    print('Login failed for user:', username)
    return jsonify({'message': 'Login failed'}), 401

@app.route('/guest-login', methods=['POST'])
def guest_login():
    username = request.form.get('username')
    password = request.form.get('password')

    if username is None or password is None:
        return jsonify({'message': 'Invalid request data'}), 400

    guest = guest_collection.find_one({'username': username})

    if guest and password == guest.get('password'):
        print('Login successful for guest:', username)
        guest_obj = Guest(guest)
        profile_icon_url = guest.get('profile_icon_url')
        if profile_icon_url:
            guest_obj.set_profile_icon_url(profile_icon_url)
        login_user(guest_obj)
        current_user.set_profile_icon_url(profile_icon_url)
        session['logged_in'] = True
        session['username'] = username
        logout_time = datetime.now(timezone.utc) + timedelta(seconds=5)
        session['logout_time'] = logout_time
        return redirect(url_for('index'))

    print('Login failed for guest:', username)
    return jsonify({'message': 'Invalid username or password'}), 401


@app.before_request
def check_logout_time():
    logout_time = session.get('logout_time')
    if logout_time and datetime.now(timezone.utc) >= logout_time:
        if request.path != '/logout' and current_user.is_authenticated:
            return redirect(url_for('logout'))


@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    session.pop('logged_in', None)
    session.pop('username', None)
    return redirect(url_for('index'))


@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    firsn = request.form['firsn']
    lasn = request.form['lasn']
    email = request.form['email']
    phone = request.form['phone']
    postcode = request.form['postcode']
    password = request.form['password'].encode('utf-8')

    error_messages = []

    if user_collection.find_one({'username': username}):
        error_message = 'Username already exists'
        return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, login=loginpth, error_message=error_message)

    if user_collection.find_one({'email': email}):
        error_message = 'Email already exists'
        return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, login=loginpth, error_message=error_message)

    if len(username) < 3 or len(username) > 20:
        error_messages.append('Username must be between 3 and 20 characters')

    if len(firsn) < 2 or len(firsn) > 50:
        error_messages.append('First name must be between 2 and 50 characters')

    if len(lasn) < 2 or len(lasn) > 50:
        error_messages.append('Last name must be between 2 and 50 characters')

    if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', email):
        error_messages.append('Invalid email address')

    if len(phone) < 10 or len(phone) > 15:
        error_messages.append('Phone number must be between 10 and 15 characters')

    if len(postcode) != 6:
        error_messages.append('Invalid postcode')

    if len(password) < 8:
        error_messages.append('Password must be at least 8 characters long')

    if error_messages:
        return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, login=loginpth, error_messages=error_messages)

    user_data = {
        'username': username,
        'firsn': firsn,
        'lasn': lasn,
        'email': email,
        'phone': phone,
        'postcode': postcode,
        'password': bcrypt.hashpw(password, bcrypt.gensalt())
    }

    user_collection.insert_one(user_data)

    flash('Registration successful! You can now login', 'success')
    return redirect(url_for('index'))


@app.route('/delete_account', methods=['POST'])
@login_required
def delete_account():
    user_id = current_user.id

    user_collection.delete_one({'_id': ObjectId(user_id)})

    flash('Account deleted successfully!', 'success')
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=False)

