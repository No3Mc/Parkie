from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, current_app
import secrets
import bcrypt
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from flask_mail import Mail, Message
import os
import re
from flask_login import logout_user
from werkzeug.utils import secure_filename
from google.cloud import storage
from Manage.MngPromos import add_promo, delete_promo, edit_promo, promos_collection
from Manage.MngCusts import edit_user_route, delete_user_route




# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')

user_db = client['USER_DB']
user_collection = user_db['users']

admin_db = client['Admin_DB']
admin_collection = admin_db['admins']



app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/',
            static_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/static')

app.secret_key = secrets.token_hex(16)

# Configure Flask-Mail settings
app.config['MAIL_SERVER'] = 'smtp.aol.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'help.almadad@aol.com'

# Create a Mail instance
mail = Mail(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'

# Rate limiting for failed login attempts
failed_logins = {}


class User(UserMixin):
    def __init__(self, user_dict):
        self.id = str(user_dict['_id'])
        self.username = user_dict['username']
        self.profile_icon_url = user_dict.get('profile_icon_url')
        self.is_admin = False  # Add is_admin attribute

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
    return render_template('index.html', header='routes/CustDev/layout/header.html', footer='routes/CustDev/layout/footer.html')   

@app.route('/main')
def main():
    return render_template('routes/ParkDev/parking/main.html', header='routes/CustDev/layout/header.html', footer='routes/CustDev/layout/footer.html')

@app.route('/get-header')
def get_header():
    return render_template('routes/CustDev/layout/header.html')

@app.route('/get-footer')
def get_footer():
    with open('/home/thr33/Downloads/Parkie/Core/routes/CustDev/layout/footer.html', 'r') as file:
        footer_content = file.read()
    return footer_content


# return render_template('/home/thr33/Downloads/Parkie/Core/index.html', header='header.html')


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
    return render_template('routes/CustDev/Dashboards/ADashboard.html')


@app.route('/dashboard')
def dashboard():
    return render_template('routes/CustDev/Dashboards/CDashboard.html')

@app.route('/MngCusts')
def MngCusts():
    users = user_collection.find()
    return render_template('routes/CustDev/Manage/MngCusts.html', users=users)

@app.route('/MngProfile')
def MngProfile():
    return render_template('routes/CustDev/Manage/MngProfile.html')

@app.route('/MngPromos')
def MngPromos():
    promos = promos_collection.find()
    return render_template('routes/CustDev/Manage/MngPromos.html', promos=promos)

# @app.route('/bawt')
# def bawt():
#     return render_template('http://127.0.0.1:8000/')

@app.route('/DocnFAQ')
def DocnFAQ():
    return render_template('routes/CustDev/VulFaq/DocnFAQ.html')

@app.route('/rpg')
def rpg():
    return render_template('routes/CustDev/LogReg/Register.html')

@app.route('/history')
def history():
    return redirect('http://localhost:3000/histroy.html')


@app.route('/login', methods=['POST'])
def login():
    ip_address = request.remote_addr
    if rate_limited(ip_address):
        flash('Too many failed login attempts. Please try again later.', 'error')
        return redirect(url_for('index'))

    username = request.form['username']
    password = request.form['password'].encode('utf-8')

    user = user_collection.find_one({'username': username})
    admin = admin_collection.find_one({'username': username})

    if user and bcrypt.checkpw(password, user['password']):
        print('Login successful for user:', username)
        user_obj = User(user)
        profile_icon_url = user.get('profile_icon_url')
        if profile_icon_url:
            user_obj.set_profile_icon_url(profile_icon_url)
        login_user(user_obj)
        # Set the profile icon URL in the current_user object
        current_user.set_profile_icon_url(profile_icon_url)
        return redirect(url_for('index'))
    elif admin and bcrypt.checkpw(password, admin['password'].encode('utf-8')):  # Encode admin password as bytes
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
    else:
        print('Login failed for user:', username)
        return jsonify({'message': 'Login failed'}), 401




@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    firsn = request.form['firsn']
    lasn = request.form['lasn']
    email = request.form['email']
    phone = request.form['phone']
    postcode = request.form['postcode']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    error_message = None

    # Check if the email ends with .net, .org, or .com
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.(net|org|com)$', email):
        error_message = 'Email must end with .net, .org, or .com'
        return render_template('routes/CustDev/LogReg/Register.html', error_message=error_message)

    # hash password using bcrypt
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    # check if user already exists
    if user_collection.find_one({'email': email}):
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
        user_collection.insert_one(user_data)

        # remove the original password from the dictionary
        del user_data['password']

        # Save the profile icon to Google Cloud Storage
        if 'profile_icon' in request.files:
            profile_icon = request.files['profile_icon']

            filename = 'thr33.png'  # Is bc ko koi next level ka keera hai. Bhosarika
            bucket_name = 'parkie'
            storage_client = storage.Client.from_service_account_json(
                '/home/thr33/Downloads/parkie-org-7b65cdd695df.json')
            bucket = storage_client.bucket(bucket_name)
            blob = bucket.blob(filename)
            blob.upload_from_file(profile_icon)

            # Get the public URL of the uploaded file
            profile_icon_url = blob.public_url

            # Add the profile icon URL to the user_data dictionary
            user_data['profile_icon_url'] = profile_icon_url

        flash('Registration successful! Please check your email to verify your account', 'success')

        return redirect(url_for('index'))

    return render_template('routes/CustDev/LogReg/Register.html')


@app.route('/verify/<token>')
def verify(token):
    # check if token is valid
    user = user_collection.find_one({'token': token})
    if not user:
        flash('Invalid token', 'error')
    else:
        # update user to verified email and remove token
        user_collection.update_one({'_id': user['_id']}, {'$set': {'verified': True}, '$unset': {'token': 1}})
    flash('Email verified! You can now log in', 'success')

    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)

