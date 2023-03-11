import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import { mongoURI } from './config/keys';
import User from './models/User';

const app = express();

app.use(cors());

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected'))
  .catch(err => console.log(err));

// Route to handle login requests
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

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
