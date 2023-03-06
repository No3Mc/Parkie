const http = require('http');
const url = require('url');
const fs = require('fs');
const mongodb = require('mongodb');

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

  const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/login' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const { email, password } = JSON.parse(body);
        loginUser(email, password, (err, result) => {
          if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end('Internal server error');
          } else if (result) {
            res.statusCode = 200;
            res.end('Login successful');
          } else {
            res.statusCode = 401;
            res.end('Login failed');
          }
        });
      });
    } else {
      res.statusCode = 404;
      res.end('Page not found');
    }
  });

  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
});
