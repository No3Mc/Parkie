const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;
const User = require('./.models/User');

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

// Route to handle login requests
app.post('/api/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if email and password match any document in MongoDB
  User.findOne({ email, password }).then(user => {
    if (user) {
      return res.status(200).json({ message: 'User exists' });
    } else {
      return res.status(404).json({ message: 'User does not exist' });
    }
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));
