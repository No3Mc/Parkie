const http = require('http');
const url = require('url');
const fs = require('fs');

const express = require('express');
const app = express();
const port = 3000;

const { loginUser } = require('./logindb');

app.use(express.static('public'));
app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  loginUser(email, password, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
    } else if (result) {
      res.status(200).send('Login successful');
    } else {
      res.status(401).send('Login failed');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
