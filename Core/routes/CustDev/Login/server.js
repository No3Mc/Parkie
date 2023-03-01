const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017';
const dbName = 'USER_DB';
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

client.connect((err) => {
  if (err) {
    console.log('Failed to connect to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  const db = client.db(dbName);
  const users = db.collection('users');

  // Add login authentication code here
});
app.post('/login', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
  
    loginUser(email, password, function(err, success) {
      if (err) {
        res.status(500).send('Failed to authenticate user');
      } else if (success) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid email or password');
      }
    });
  });
  