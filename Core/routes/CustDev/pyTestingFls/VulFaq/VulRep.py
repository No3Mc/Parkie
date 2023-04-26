from pymongo import MongoClient
from flask import Flask, render_template, request, redirect, url_for, session
import secrets
from flask import flash

# app = Flask(__name__, template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/VulFaq')
app = Flask(__name__, static_url_path='', static_folder='static', template_folder='/home/thr33/Downloads/Parkie/Core/routes/CustDev/VulFaq')
app.secret_key = secrets.token_hex(16)

# MongoDB Atlas connection string for the Reports database
client = MongoClient('mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/?retryWrites=true&w=majority')
db = client['Reports']
vuln_reports_collection = db['VulReps']

@app.route('/')
def index():
    return render_template('VulRep.html')

@app.route('/vulnerability_report', methods=['POST'])
def vulnerability_report():
    name = request.form['name']
    email = request.form['email']
    description = request.form['description']

    # insert vulnerability report into database
    vuln_report_data = {
        'name': name,
        'email': email,
        'description': description
    }
    vuln_reports_collection.insert_one(vuln_report_data)
    flash('Vulnerability report submitted successfully!', 'success')

    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
