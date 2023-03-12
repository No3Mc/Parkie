function loginUser(usernameInput, passwordInput) {
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch('../users.csv') // path to the CSV file relative to the HTML file
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // split the CSV into rows and remove the header
        const userArray = rows.filter(row => row.trim() !== '').map(row => {
          const [storedUsername, storedPassword] = row.split(',');
          return { storedUsername, storedPassword: storedPassword.trim() }; // trim whitespace from storedPassword
        });
        for (let i = 0; i < userArray.length; i++) {
          const { storedUsername, storedPassword } = userArray[i];
          if (storedUsername === username && storedPassword === password) {
            console.log('Login successful');
            return;
          }
        }
        console.log('Invalid username or password');
      });
  }
  