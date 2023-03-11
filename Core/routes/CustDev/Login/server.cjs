import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const uri = 'mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Connected to MongoDB Atlas cluster!');
    const db = client.db('USER_DB');
    const usersCollection = db.collection('users');

    // function to check if user with given email and password exists in the database
    function checkUser(email, password) {
      return usersCollection.findOne({ email: email, password: password })
        .then(user => {
          if (user) {
            return true; // user found
          } else {
            return false; // user not found
          }
        });
    }

    // route for handling login form submission
    app.post('/login', (req, res) => {
      const email = req.body.email;
      const password = req.body.password;

      // check if user exists in the database
      checkUser(email, password)
        .then(userExists => {
          if (userExists) {
            res.send('User valid');
          } else {
            res.send('User invalid');
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).send('Error');
        });
    });

    // start the server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  })
  .catch(err => {
    console.log(err);
  });
