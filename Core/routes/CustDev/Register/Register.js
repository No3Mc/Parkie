function registerUser(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const postcode = document.getElementById('postcode').value;
    const password = document.getElementById('password').value;
    const userData = [name, email, phone, postcode, password].join(',');
    fetch('../users.csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/csv'
      },
      body: userData
    })
    .then(response => {
      console.log('User registered successfully');
      window.location.href = '../Login/login.html'; // redirect to login page after registration
    })
    .catch(error => console.error('Error registering user:', error));
  
    // Append the new user's data to the CSV file
    const userRow = `\n${userData}`;
    fetch('../users.csv', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/csv'
      },
      body: userRow
    })
    .catch(error => console.error('Error adding user to CSV:', error));
  }
  