from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets
from flask import flash

app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/LogReg')
app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    user = users_collection.find_one({'email': email})

    if user and user['password'] == password:
        print('Login successful for user:', email)
        flash('Login successful!', 'success')
    else:
        print('Login failed for user:', email)
        flash('Invalid email or password', 'error')

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
