// Initialize the Facebook SDK
window.fbAsyncInit = function() {
  FB.init({
  appId: '875175060267333',
  cookie: true,
  xfbml: true,
  version: 'v8.0'
  });
  
  FB.AppEvents.logPageView();
  
  // Check the user's login status
  FB.getLoginStatus(statusChangeCallback);
  };
  
  // Load the Facebook SDK asynchronously
  (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = 'https://connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  
  // Handle form submission
  const form = document.getElementById('login-form');
  form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!username || !password) {
  const message = document.getElementById('message');
  message.textContent = 'Please enter your username and password.';
  message.style.color = 'red';
  return;
  }
  
  // Submit the form
  form.submit();
  });
  
  // Handle Google login
  const googleButton = document.querySelector(".option-heading:contains('Use Google Account')").parentNode;
  googleButton.addEventListener('click', function(event) {
  event.preventDefault();
  gapi.auth2.getAuthInstance().signIn();
  });
  
  // Initialize the Google API
  function init() {
  gapi.load('auth2', function() {
  gapi.auth2.init({
  client_id: '300363373850-okp895hrqjoie27jptut02nljknelgfl.apps.googleusercontent.com'
  });
  });
  }
  
  // Handle the user's login status for Facebook
  function statusChangeCallback(response) {
  if (response.status === 'connected') {
  console.log('User is logged in and has authorized your app.');
  } else {
  console.log('User is not logged in or has not authorized your app.');
  }
  }