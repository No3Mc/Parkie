
document.addEventListener('DOMContentLoaded', function() {
  // Facebook login button click handler
  document.getElementById('facebook-login-button').addEventListener('click', function() {
    FB.login(function(response) {
      if (response.authResponse) {
        console.log('Facebook login successful');
        // You can handle the logged in user here
      } else {
        console.log('Facebook login failed');
      }
    }, {scope: 'public_profile,email'});
  });

  // Google login button click handler
  document.getElementById('google-login-button').addEventListener('click', function() {
    gapi.auth2.getAuthInstance().signIn().then(function(response) {
      console.log('Google login successful');
      // You can handle the logged in user here
    }, function(error) {
      console.log('Google login failed');
    });
  });

  // Google API library initialization
  function initGoogleAuth() {
    gapi.load('auth2', function() {
      gapi.auth2.init({
        client_id: '300363373850-okp895hrqjoie27jptut02nljknelgfl.apps.googleusercontent.com'
      });
    });
  }

  // Facebook SDK initialization
  window.fbAsyncInit = function() {
    FB.init({
      appId: '875175060267333',
      cookie: true,
      xfbml: true,
      version: 'v10.0'
    });
  };

  // Load the Facebook SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Load the Google API library asynchronously
  var googleApiScript = document.createElement('script');
  googleApiScript.src = 'https://apis.google.com/js/platform.js';
  googleApiScript.async = true;
  googleApiScript.defer = true;
  googleApiScript.onerror = function() {
    console.log('Failed to load Google API library');
  };
  googleApiScript.addEventListener('load', function() {
    initGoogleAuth();
  });
  document.head.appendChild(googleApiScript);



});
