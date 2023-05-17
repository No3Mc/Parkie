document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");
  const guestButton = document.getElementById("guest-button");
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username-input");
  const passwordInput = document.getElementById("password-input");
  const profileIcon = document.querySelector(".profile-icon");
  const logoutLink = document.querySelector(".dropdown-content");
  const loginSubmitButton = document.getElementById("login-submit");

    if (loginButton) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault();
            toggleLoginForm();
        });
    }

    if (loginSubmitButton) {
        loginSubmitButton.addEventListener("click", function(event) {
            event.preventDefault();
            login();
        });
    }

    function toggleLoginForm() {
        loginForm.classList.toggle("open");
    }
if (guestButton) {
    guestButton.addEventListener("click", function(event) {
        event.preventDefault();
        guestLogin();
    });
}

function guestLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Create form data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Send an AJAX request to the guest-login route
    axios.post("/guest-login", formData)
        .then(function(response) {
            // Handle the response
            if (response.status === 200) {
                // Guest login successful, redirect to the homepage or desired page
                window.location.href = "/";
            } else {
                // Guest login failed, show an error message
                alert("Guest login failed. Please check your credentials and try again.");
            }
        })
        .catch(function(error) {
            // Error occurred, show an error message
            alert("An error occurred during guest login. Please try again later.");
        });
}


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

  if (profileIcon) {
    profileIcon.addEventListener("click", function(event) {
      event.stopPropagation(); // Prevent event bubbling

      logoutLink.classList.toggle("open");
    });
  }

  window.addEventListener("click", function() {
    if (logoutLink.classList.contains("open")) {
      logoutLink.classList.remove("open");
    }
  });
});

