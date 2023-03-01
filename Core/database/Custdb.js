document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.querySelector('#register-form');
  const loginForm = document.querySelector('#login-form');

  // Rest of the code goes here
});

// Register form submit event handler
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get form data
  const email = registerForm.elements.email.value;
  const password = registerForm.elements.password.value;
  const confirmPassword = registerForm.elements['confirm-password'].value;
  const phone = registerForm.elements.phone.value;

  // Validate form data
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Send POST request to register user
  fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, phone })
  })
  .then((res) => {
    if (res.ok) {
    alert('User registered successfully');
    registerForm.reset();
    } else {
    alert('Error registering user');
    }
    })
    .catch((err) => console.error(err));
    });
    
    // Login form submit event handler
    loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const email = loginForm.elements.email.value;
    const password = loginForm.elements.password.value;
    
    // Send POST request to login user
    fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
    })
    .then((res) => {
    if (res.ok) {
    alert('Login successful');
    loginForm.reset();
    } else {
    alert('Invalid email or password');
    }
    })
    .catch((err) => console.error(err));
    });