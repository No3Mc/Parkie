const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;


  // hardcoded for now, but we can add a database later
  if (username === "admin" && password === "password") {
    alert("Login Successful!");
  } else {
    alert("Invalid username or password.");
  }
});
