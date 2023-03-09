const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true }));

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  }

  console.log('Connected to the database');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  client.db('USER_DB').collection('users').findOne({ email, password }, (err, user) => {
    if (err) {
      console.error('Failed to query the database:', err);
      res.status(500).send('Internal server error');
      return;
    }

    if (user) {
      res.send('Successful');
    } else {
      res.send('Invalid');
    }
  });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
