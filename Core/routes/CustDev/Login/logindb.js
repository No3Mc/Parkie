// logindb.js
import mongodb from './node_modules/mongodb/index.js';


const uri = 'mongodb://localhost:27017/USER_DB';
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });

const loginUser = function(email, password, callback) {
  client.connect((err) => {
    if (err) {
      console.log('Failed to connect to MongoDB:', err);
      callback(err);
      return;
    }

    console.log('Connected to MongoDB');

    const db = client.db();
    const users = db.collection('users');

    users.findOne({ email: email, password: password }, function(err, user) {
      if (err) {
        callback(err);
      } else if (user) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  });
};

export { loginUser };
