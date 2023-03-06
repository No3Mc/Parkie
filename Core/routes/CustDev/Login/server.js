const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const { loginUser } = require('./logindb');

const app = express();
app.use(bodyParser.json());

const uri = 'mongodb://localhost:27017/USER_DB';
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

app.post('/login', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  client.connect(function(err) {
    if (err) {
      console.log('Failed to connect to MongoDB:', err);
      res.status(500).send('Failed to connect to database');
      return;
    }

    console.log('Connected to MongoDB');

    const db = client.db();
    const users = db.collection('users');

    loginUser(email, password, function(err, success) {
      if (err) {
        console.log('Failed to authenticate user:', err);
        res.status(500).send('Failed to authenticate user');
      } else if (success) {
        console.log('Login successful');
        res.status(200).send('Login successful');
      } else {
        console.log('Invalid email or password');
        res.status(401).send('Invalid email or password');
      }

      client.close();
    });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
