const registerForm = document.querySelector('#register-form');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // extract the form data
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm-password').value;
  const phone = document.querySelector('#phone').value;

  // validate the form data (e.g., check that the passwords match)

  // send an HTTP POST request to the /register endpoint
  const response = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, phone })
  });

  // handle the response from the server
  if (response.ok) {
    // redirect to the login page or perform some other action
  } else {
    const error = await response.text();
    alert(`Error registering user: ${error}`);
  }
});
