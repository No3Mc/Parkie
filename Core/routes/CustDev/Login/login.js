import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/user_db' }),
}));

mongoose.connect('mongodb://localhost:27017/user_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (user) {
      req.session.userId = user._id;

      res.send('User authenticated');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/', (req, res) => {
  const { userId } = req.session;

  if (userId) {
    res.send('Welcome!');
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <label for="email">Email:</label>
      <input type="email" name="email" id="email" required><br>
      <label for="password">Password:</label>
      <input type="password" name="password" id="password" required><br>
      <button type="submit">Log in</button>
    </form>
  `);
});

app.listen(3000, () => console.log('Server started'));












// document.addEventListener('DOMContentLoaded', function() {
//   // Facebook login button click handler
//   document.getElementById('facebook-login-button').addEventListener('click', function() {
//     FB.login(function(response) {
//       if (response.authResponse) {
//         console.log('Facebook login successful');
//         // You can handle the logged in user here
//       } else {
//         console.log('Facebook login failed');
//       }
//     }, {scope: 'public_profile,email'});
//   });

//   // Google login button click handler
//   document.getElementById('google-login-button').addEventListener('click', function() {
//     gapi.auth2.getAuthInstance().signIn().then(function(response) {
//       console.log('Google login successful');
//       // You can handle the logged in user here
//     }, function(error) {
//       console.log('Google login failed');
//     });
//   });

//   // Google API library initialization
//   function initGoogleAuth() {
//     gapi.load('auth2', function() {
//       gapi.auth2.init({
//         client_id: '300363373850-okp895hrqjoie27jptut02nljknelgfl.apps.googleusercontent.com'
//       });
//     });
//   }

//   // Facebook SDK initialization
//   window.fbAsyncInit = function() {
//     FB.init({
//       appId: '875175060267333',
//       cookie: true,
//       xfbml: true,
//       version: 'v10.0'
//     });
//   };

//   // Load the Facebook SDK asynchronously
//   (function(d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) return;
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
//   }(document, 'script', 'facebook-jssdk'));

//   // Load the Google API library asynchronously
//   var googleApiScript = document.createElement('script');
//   googleApiScript.src = 'https://apis.google.com/js/platform.js';
//   googleApiScript.async = true;
//   googleApiScript.defer = true;
//   googleApiScript.onerror = function() {
//     console.log('Failed to load Google API library');
//   };
//   googleApiScript.addEventListener('load', function() {
//     initGoogleAuth();
//   });
//   document.head.appendChild(googleApiScript);








// //LET IT BE AS IT IS @No3Mc is working on it

//   const form = document.querySelector('form');
//   form.addEventListener('submit', function(event) {
//     event.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('pass').value;

//     fetch('/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email: email, password: password })
//     })
//     .then(function(response) {
//       if (response.ok) {
//         console.log('Login successful');
//       } else {
//         console.log('Login failed');
//       }
//     });
//   });
























// });
