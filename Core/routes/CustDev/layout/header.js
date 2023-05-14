document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");

  loginButton.addEventListener("click", function(event) {
    event.preventDefault();

    loginForm.classList.toggle("open");
  });

  passwordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      login();
    }
  });

  function login() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Create form data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch("/login", {
      method: "POST",
      body: new URLSearchParams(formData)
    })
      .then(function(response) {
        if (response.ok) {
          console.log("Login successful");
        } else {
          console.log("Login failed");
        }
      })
      .catch(function(error) {
        console.log("An error occurred during login");
      });
  }
});

