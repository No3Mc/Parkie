const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// connect to your MongoDB database
mongoose.connect('mongodb://localhost/USER_DB');

// define a schema for the user data
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true }
});

// create a Mongoose model for the user data
const User = mongoose.model('User', userSchema);

// parse incoming requests with JSON payloads
app.use(bodyParser.json());

// handle POST requests to /register
app.post('/register', (req, res) => {
  // extract the user data from the request body
  const { email, password, phone } = req.body;

  // create a new User object with the extracted data
  const user = new User({ email, password, phone });

  // save the new user object to the database
  user.save((err, savedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('An error occurred while registering the user.');
    } else {
      console.log(`User ${savedUser.email} registered successfully.`);
      res.status(200).send('User registered successfully.');
    }
  });
});

// start the server and handle requests
app.listen(3000, () => {
  console.log('Server listening on port 3000.');

  // handle POST requests to /login
  app.post('/login', (req, res) => {
    // extract the email and password from the request body
    const { email, password } = req.body;

    // find the user with the provided email in the database
    User.findOne({ email }, (err, user) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred while logging in.');
      } else if (!user) {
        res.status(401).send('User not found.');
      } else if (user.password !== password) {
        res.status(401).send('Incorrect password.');
      } else {
        console.log(`User ${user.email} logged in successfully.`);
        res.status(200).send('User logged in successfully.');
      }
    });
  });
});
