from pymongo import MongoClient
import secrets
import bcrypt
from flask_login import LoginManager, login_user, current_user, login_required, UserMixin
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from flask_login import logout_user
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify, current_app


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



# Configure Flask-Mail settings
# app.config['MAIL_SERVER'] = 'smtp.aol.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
# app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
# app.config['MAIL_USE_TLS'] = False
# app.config['MAIL_USE_SSL'] = True
# app.config['MAIL_DEFAULT_SENDER'] = 'help.almadad@aol.com'
#
# # Create a Mail instance
# mail = Mail(app)
#
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'index'


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

