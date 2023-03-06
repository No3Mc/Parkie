const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017/USER_DB';
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

client.connect((err) => {
  if (err) {
    console.log('Failed to connect to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  const db = client.db();
  const users = db.collection('users');

  // Add login authentication code here
  function loginUser(email, password, callback) {
    users.findOne({ email: email, password: password }, function(err, user) {
      if (err) {
        callback(err);
      } else if (user) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  }

  module.exports = { loginUser };
});

