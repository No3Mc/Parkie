from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['USER_DB']
users_collection = db['users']

@app.route('/')
def index():
    return render_template('Core/routes/CustDev/Login/login.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']

    user = users_collection.find_one({'email': email})

    if user and user['password'] == password:
        print('Login successful for user:', email)
        return ''
    else:
        print('Login failed for user:', email)
        return ''

@app.route('/dashboard')
def dashboard():
    email = session.get('email')

    if email:
        return render_template('Core/routes/CustDev/CDashboard/CDashboard.html', email=email)
    else:
        return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
