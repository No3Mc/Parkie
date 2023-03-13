function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const postcode = document.getElementById('postcode').value;
    const password = document.getElementById('password').value;
    const userData = new FormData();
    userData.append('name', name);
    userData.append('email', email);
    userData.append('phone', phone);
    userData.append('postcode', postcode);
    userData.append('password', password);
    fetch('../register.php', {
      method: 'POST',
      body: userData
    })
    .then(response => {
      console.log('User registered successfully');
      window.location.href = '../Login/login.html'; // redirect to login page after registration
    })
    .catch(error => console.error('Error registering user:', error));
  }
