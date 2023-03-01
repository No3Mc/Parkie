const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'USER_DB';

function loginUser(email, password, callback) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      console.log('Failed to connect to database');
      return callback(err);
    }

    const db = client.db(dbName);
    const users = db.collection('users');

    users.findOne({ email: email, password: password }, function(err, user) {
      if (err) {
        console.log('Failed to find user in database');
        return callback(err);
      }

      if (!user) {
        console.log('Invalid email or password');
        return callback(null, false);
      }

      console.log('Login successful');
      return callback(null, true);
    });
  });
}

module.exports = {
  loginUser: loginUser
};
