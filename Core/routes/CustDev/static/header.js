document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const loginStatus = document.getElementById("login-status");

  loginButton.addEventListener("click", function (event) {
    event.preventDefault();

    loginForm.classList.toggle("open");
  });

  passwordInput.addEventListener("keydown", function (event) {
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
      body: new URLSearchParams(formData),
    })
      .then(function (response) {
        if (response.status === 200) {
          loginStatus.textContent = "Login successful";
          loginStatus.style.color = "green";
        } else if (response.status === 401) {
          loginStatus.textContent = "Login failed";
          loginStatus.style.color = "red";
        } else {
          loginStatus.textContent = "Unexpected response";
          loginStatus.style.color = "red";
        }
      })
      .catch(function (error) {
        loginStatus.textContent = "An error occurred during login";
        loginStatus.style.color = "red";
      });
  }
});

