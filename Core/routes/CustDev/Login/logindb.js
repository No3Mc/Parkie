// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// Set up the express app
const app = express();

// Use bodyParser middleware to parse incoming request bodies
app.use(bodyParser.json());

// Connect to the MongoDB database
const url = 'mongodb://localhost:27017';
const dbName = 'USER_DB';
MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log('Failed to connect to the database:', err);
    return;
  }
  console.log('Connected to the database successfully');
  const db = client.db(dbName);

  // Define the login endpoint
  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const collection = db.collection('users');
    collection.findOne({ email: email, password: password }, (err, user) => {
      if (err) {
        console.log('Failed to find user:', err);
        res.status(500).send('Failed to find user');
        return;
      }
      if (!user) {
        console.log('Invalid email or password');
        res.status(401).send('Invalid email or password');
        return;
      }
      console.log('User logged in successfully');
      res.send('User logged in successfully');
    });
  });

  // Start the server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
