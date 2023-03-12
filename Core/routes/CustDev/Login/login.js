function loginUser(usernameInput, passwordInput) {
    const username = usernameInput.value;
    const password = passwordInput.value;
    fetch('users.txt')
      .then(response => response.text())
      .then(data => {
        const userArray = data.split('\n');
        for (let i = 0; i < userArray.length; i++) {
          const [storedUsername, storedPassword] = userArray[i].split(':');
          if (storedUsername === username && storedPassword === password) {
            console.log('Login successful');
            return;
          }
        }
        console.log('Invalid username or password');
      });
  }
  