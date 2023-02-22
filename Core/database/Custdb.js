// Import the necessary dependencies
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// Set up the express app
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to the MongoDB server
const url = 'mongodb://localhost:27017';
const dbName = 'userDB';
let db;

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  console.log('Connected to MongoDB server successfully!');
  db = client.db(dbName);
});

// Define the routes for registration and login
app.post('/register', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  // Check if the email already exists in the database
  db.collection('users').findOne({ email: email }, function(err, result) {
    if (err) throw err;
    if (result) {
      res.send('Email already exists!');
    } else {
      // Insert the new user into the database
      db.collection('users').insertOne({ email: email, password: password, phone: phone }, function(err, result) {
        if (err) throw err;
        res.send('Registration successful!');
      });
    }
  });
});

app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Find the user with the given email and password
  db.collection('users').findOne({ email: email, password: password }, function(err, result) {
    if (err) throw err;
    if (result) {
      res.send('Login successful!');
    } else {
      res.send('Invalid email or password!');
    }
  });
});

// Start the server
const port = 3000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
