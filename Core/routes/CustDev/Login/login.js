// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({region: 'REGION'});

// Create the DynamoDB Document Client
var docClient = new AWS.DynamoDB.DocumentClient();


// Use the Document Client to query the table
docClient.query(params, function(err, data) {
  if (err) {
    console.error('Unable to query. Error:', JSON.stringify(err, null, 2));
  } else {
    console.log('Query succeeded:', JSON.stringify(data, null, 2));
  }
});























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
