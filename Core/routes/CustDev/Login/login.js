const facebookLoginButton = document.getElementById('facebook-login-button');
facebookLoginButton.addEventListener('click', function() {
  FB.login(function(response) {
    if (response.authResponse) {
      console.log('User is logged in and has authorized your app.');
    } else {
      console.log('User is not logged in or has not authorized your app.');
    }
  }, {scope: 'email'});
});


const googleLoginButton = document.getElementById('google-login-button');
googleLoginButton.addEventListener('click', function() {
  gapi.auth2.getAuthInstance().signIn().then(function(response) {
    console.log('User is logged in and has authorized your app.');
  }).catch(function(error) {
    console.log('User is not logged in or has not authorized your app.');
  });
});
