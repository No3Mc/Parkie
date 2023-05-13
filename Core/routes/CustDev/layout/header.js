document.addEventListener("DOMContentLoaded", function() {
  const loginButton = document.getElementById("login-button");
  const loginForm = document.getElementById("login-form");

  loginButton.addEventListener("click", function(event) {
    event.preventDefault(); 

    loginForm.classList.toggle("open"); 
  });
});
