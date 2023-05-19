from pymongo import MongoClient  # MongoDB client library
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, current_app  # Flask framework modules
import secrets  # Module for generating secure tokens
import bcrypt  # Password hashing module
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin  # Flask-Login for user authentication
from datetime import datetime, timedelta, timezone  # Date and time modules
from bson.objectid import ObjectId  # MongoDB ObjectID
from flask_mail import Mail, Message  # Flask-Mail for sending emails
import os  # OS module for file operations
import re  # Regular expression module
from flask_login import logout_user  # Logout functionality
from werkzeug.utils import secure_filename  # Secure filename handling
from google.cloud import storage  # Google Cloud Storage client library
from Manage.MngPromos import add_promo, delete_promo, edit_promo, promos_collection  # Import from custom modules
from Manage.MngCusts import edit_user_route, delete_user_route  # Import from custom modules
from VulFaq.VulRep import index as vulrep_index, vulnerability_report as vulrep_vulnerability_report  # Import from custom modules
from Manage.MngProfile import index as mngprofile_index, login as mngprofile_login, edit_user as mngprofile_edit_user  # Import from custom modules
# import quickemailverification  # Uncomment if required


# Define paths for template and static files
template_folder_path = '/home/thr33/Downloads/Parkie/Core'
static_folder_path = '/home/thr33/Downloads/Parkie/Core/routes/CustDev/static'

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

app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Set maximum content length for file uploads

app.secret_key = secrets.token_hex(16)  # Set secret key for session encryption

login_manager = LoginManager()  # Initialize LoginManager
login_manager.init_app(app)
login_manager.login_view = 'index'  # Set login view

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
        self.is_admin = False  # Add is_admin attribute

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


# Inject the current user into the context of templates
@app.context_processor
def inject_user():
    return dict(current_user=current_user)


# Load a user from the database based on the user ID
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


# Rate limiting for failed login attempts
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


# Route for the index page
@app.route('/')
def index():
    return render_template('index.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for the main page (login required)
@app.route('/main')
@login_required
def main():
    return render_template('routes/ParkDev/parking/main.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for the lend page
@app.route('/lend')
def lend():
    return render_template('routes/ClientDev/Lend.html', header=headerpth, footer=footerpth, login=loginpth)

# Route for the lend page
@app.route('/future')
def future():
    return render_template('future.html', header=headerpth, footer=footerpth, login=loginpth)



# Route for the howto page
@app.route('/howto')
def howto():
    return render_template('routes/ParkDev/Howitworks/How.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for adding a promo
@app.route('/add-promo', methods=['POST'])
def add_promo_route():
    return add_promo()


# Route for deleting a promo
@app.route('/delete-promo/<string:promo_id>', methods=['POST'])
def delete_promo_route(promo_id):
    return delete_promo(promo_id)


# Route for editing a promo
@app.route('/edit-promo/<string:promo_id>', methods=['GET', 'POST'])
def edit_promo_route(promo_id):
    return edit_promo(promo_id)


# Route for editing a user
@app.route('/edit_user', methods=['GET', 'POST'])
def edit_user():
    return edit_user_route()


# Route for deleting a user
@app.route('/delete_user', methods=['POST'])
def delete_user():
    return delete_user_route()


# Route for the vulnerability report index page
@app.route('/vulrep')
def vulrep_index_route():
    return vulrep_index()


# Route for submitting a vulnerability report
@app.route('/vulnerability_report', methods=['POST'])
def vulrep_vulnerability_report_route():
    return vulrep_vulnerability_report()


# Route for the management profile login
@app.route('/mngprofile_login', methods=['POST'])
def mngprofile_login():
    return redirect(url_for('MngProfile'))


# Route for editing a user in the management profile
@app.route('/mngprofile_edit_user', methods=['POST'])
def mngprofile_edit_user():
    return redirect(url_for('MngProfile'))


# Route for the admin dashboard (login required)
@app.route('/admin_dashboard')
@login_required
def admin_dashboard():
    return render_template('routes/CustDev/Dashboards/ADashboard.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for the user dashboard
@app.route('/dashboard')
def dashboard():
    return render_template('routes/CustDev/Dashboards/CDashboard.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for managing customers
@app.route('/MngCusts')
def MngCusts():
    users = user_collection.find()
    return render_template('routes/CustDev/Manage/MngCusts.html', users=users)


# Route for managing user profile
@app.route('/MngProfile')
def MngProfile():
    return render_template('routes/CustDev/Manage/MngProfile.html')


# Route for managing promotions
@app.route('/MngPromos')
def MngPromos():
    promos = promos_collection.find()
    return render_template('routes/CustDev/Manage/MngPromos.html', promos=promos)


# Route for the "bawth" page
@app.route('/bawth')
def bawth():
    return render_template('routes/CustDev/bot/sbot.html')


# Route for the help page
@app.route('/help')
def help():
    return render_template('routes/CustDev/VulFaq/DocnFAQ.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for the AboutUs page
@app.route('/AboutUs')
def AboutUs():
    return render_template('routes/CustDev/AbtPro/AboutUs.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for the rpg page
@app.route('/rpg')
def rpg():
    return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, login=loginpth)


# Route for the history page (redirects to an external URL)
@app.route('/history')
def history():
    return redirect('http://localhost:3000/histroy.html')


# Route for the contact page
@app.route('/contact')
def multan():
    return render_template('routes/CustDev/VulFaq/VulRep.html', header=headerpth, footer=footerpth, login=loginpth)


# Login route
@app.route('/login', methods=['POST'])
def login():
    ip_address = request.remote_addr
    if rate_limited(ip_address):
        flash('Too many failed login attempts. Please try again later.', 'error')
        return redirect(url_for('index'))

    username = request.form['username']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    user = user_collection.find_one({'username': username})
    admin = admin_collection.find_one({'username': username})
    guest = guest_collection.find_one({'username': username})  # Check guest collection

    if user and bcrypt.checkpw(password, user['password']):  # compare encoded passwords
        print('Login successful for user:', username)
        user_obj = User(user)
        profile_icon_url = user.get('profile_icon_url')
        if profile_icon_url:
            user_obj.set_profile_icon_url(profile_icon_url)
        login_user(user_obj)
        # Set the profile icon URL in the current_user object
        current_user.set_profile_icon_url(profile_icon_url)
        return redirect(url_for('index'))
    elif admin and bcrypt.checkpw(password, admin['password'].encode('utf-8')):  # compare encoded passwords
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


# Guest login route
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
        # Set the profile icon URL in the current_user object
        current_user.set_profile_icon_url(profile_icon_url)

        # Set the logout time in the session as an offset-aware datetime
        logout_time = datetime.now(timezone.utc) + timedelta(seconds=5)
        session['logout_time'] = logout_time

        return redirect(url_for('index'))  # Redirect to the index page after successful login

    # Simulate incorrect credentials by returning a login failure response
    print('Login failed for guest:', username)
    return jsonify({'message': 'Invalid username or password'}), 401


# Check logout time before each request
@app.before_request
def check_logout_time():
    logout_time = session.get('logout_time')
    if logout_time and datetime.now(timezone.utc) >= logout_time:
        if request.path != '/logout' and current_user.is_authenticated:
            return redirect(url_for('logout'))


# Logout route
@app.route('/logout')
def logout():
    if current_user.is_authenticated:
        logout_user()
    return redirect(url_for('index'))


# User registration route
@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    firsn = request.form['firsn']
    lasn = request.form['lasn']
    email = request.form['email']
    phone = request.form['phone']
    postcode = request.form['postcode']
    password = request.form['password'].encode('utf-8')  # encode password to bytes

    error_messages = []

    # Check if username already exists
    if user_collection.find_one({'username': username}):
        error_message = 'Username already exists'
        return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, error_message=error_message)

    # Check if email already exists
    if user_collection.find_one({'email': email}):
        error_message = 'Email already exists'
        return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, error_message=error_message)


    # Check username length
    if len(username) < 3 or len(username) > 20:
        error_messages.append('Username must be between 3 and 20 characters')

    # Check first name length
    if len(firsn) < 2 or len(firsn) > 50:
        error_messages.append('First name must be between 2 and 50 characters')

    # Check last name length
    if len(lasn) < 2 or len(lasn) > 50:
        error_messages.append('Last name must be between 2 and 50 characters')

    # Check email length
    if len(email) < 5 or len(email) > 50:
        error_messages.append('Email must be between 5 and 50 characters')

    # Check if the email ends with .net, .org, or .com
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.(net|org|com)$', email):
        error_messages.append('Email must end with .net, .org, or .com')

    # Check postcode length
    if len(postcode) < 4 or len(postcode) > 10:
        error_messages.append('Postcode must be between 4 and 10 characters')

    if error_messages:
        return render_template('routes/CustDev/LogReg/Register.html', header=headerpth, footer=footerpth, error_messages=error_messages)

    # Hash password using bcrypt
    hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

    # Generate a random token for email verification
    token = secrets.token_hex(16)
    # Insert user into database with unverified email and token
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

    # Remove the original password from the dictionary
    del user_data['password']

    # Save the profile icon to Google Cloud Storage
    if 'profile_icon' in request.files:
        profile_icon = request.files['profile_icon']

        filename = 'thr33.png'  # Idk what went wrong here. Was working earlier
        bucket_name = 'parkie'
        storage_client = storage.Client.from_service_account_json('/home/thr33/Downloads/parkie-org-7b65cdd695df.json')
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(filename)
        blob.upload_from_file(profile_icon)

        # Get the public URL of the uploaded file
        profile_icon_url = blob.public_url

        # Add the profile icon URL to the user_data dictionary
        user_data['profile_icon_url'] = profile_icon_url

    return redirect(url_for('index'))

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=5000)

