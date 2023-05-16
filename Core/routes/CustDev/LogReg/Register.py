from flask import render_template, request, redirect, url_for, flash
import secrets
import bcrypt
import re
from google.cloud import storage

# Assuming you have the necessary HTML templates available
register_template = 'routes/CustDev/LogReg/Register.html'

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
        return render_template(register_template, error_message=error_message)

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
            blob = bucket.blob(filename)
            blob.upload_from_file(profile_icon)

            # Get the public URL of the uploaded file
            profile_icon_url = blob.public_url

            # Add the profile icon URL to the user_data dictionary
            user_data['profile_icon_url'] = profile_icon_url

        flash('Registration successful! Please check your email to verify your account', 'success')

        return redirect(url_for('index'))

    return render_template(register_template)

