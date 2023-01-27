const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "password") {
    alert("Login Successful!");
  } else {
    alert("Invalid username or password.");
  }
});
