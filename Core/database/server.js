const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection URL
const url = 'mongodb://localhost:27017';

// Database name
const dbName = 'mydb';

// Routes
app.post('/register', (req, res) => {
  // Get user data from request body
  const { email, password, phone } = req.body;

  // Connect to MongoDB
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    // Select database
    const db = client.db(dbName);

    // Check if user already exists
    db.collection('users').findOne({ email }, (err, result) => {
      if (err) throw err;

      if (result) {
        // User already exists
        res.status(409).send('User already exists');
        client.close();
      } else {
        // Create new user
        db.collection('users').insertOne({ email, password, phone }, (err) => {
          if (err) throw err;

          // User created successfully
          res.status(201).send('User created successfully');
          client.close();
        });
      }
    });
  });
});

app.post('/login', (req, res) => {
  // Get user data from request body
  const { email, password } = req.body;

  // Connect to MongoDB
  MongoClient.connect(url, (err, client) => {
    if (err) throw err;

    // Select database
    const db = client.db(dbName);

    // Find user by email and password
    db.collection('users').findOne({ email, password }, (err, result) => {
      if (err) throw err;

      if (result) {
        // User found
        res.status(200).send('Login successful');
        client.close();
      } else {
        // Invalid email or password
        res.status(401).send('Invalid email or password');
        client.close();
      }
    });
  });
});

// Start server
app.listen(port, () => console.log(`Server listening on port ${port}`));
