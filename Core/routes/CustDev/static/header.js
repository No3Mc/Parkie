document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const profileIcon = document.querySelector(".profile-icon");
  const logoutLink = document.querySelector(".logout-link");

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
      body: new URLSearchParams(formData),
    })
      .then(function (response) {
        if (response.status === 200) {
          window.location.href = "/";  
        } else if (response.status === 401) {
          alert("Login failed. Please check your credentials and try again.");
        } else {
          alert("Unexpected response. Please try again later.");
        }
      })
      .catch(function (error) {
        alert("An error occurred during login. Please try again later.");
      });
  }

  profileIcon.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent event bubbling

    logoutLink.classList.toggle("open");
  });

  window.addEventListener("click", function() {
    logoutLink.classList.remove("open");
  });
});

