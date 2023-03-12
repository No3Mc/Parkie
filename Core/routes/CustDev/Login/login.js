function loginUser(usernameInput, passwordInput) {
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch('../users.json') // path to the JSON file relative to the HTML file
      .then(response => response.json())
      .then(data => {
        const userArray = data.users;
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
