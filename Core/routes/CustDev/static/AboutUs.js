const loginForm = document.getElementById('login-form');

function showLoginForm() {
  loginForm.style.display = 'block';
}

const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', showLoginForm);

