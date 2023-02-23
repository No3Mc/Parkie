document.addEventListener('DOMContentLoaded', function() {
  const facebookLoginButton = document.getElementById('facebook-login-button');
  facebookLoginButton.addEventListener('click', function() {
    window.location.href = 'https://www.facebook.com/v12.0/dialog/oauth?client_id=875175060267333&redirect_uri=http://www.parkie.app/&scope=email';
  });

  const googleLoginButton = document.getElementById('google-login-button');
  googleLoginButton.addEventListener('click', function() {
    window.location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=300363373850&redirect_uri=http://www.parkie.app/&scope=email%20profile&response_type=code';
  });
});
