// Get the login form and add a submit event listener
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  // Get the user's email and password from the form
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  // Sign in the user with email and password
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User signed in successfully
      console.log(userCredential.user);
      // Redirect the user to the home page or some other page
    })
    .catch((error) => {
      // Handle errors
      console.error(error.code, error.message);
    });
});

// Add a click event listener to the Google sign-in button
const googleSigninButton = document.getElementById('google-signin');
googleSigninButton.addEventListener('click', () => {
  // Create a new Google authentication provider
  const provider = new firebase.auth.GoogleAuthProvider();
  // Sign in the user with Google
  firebase.auth().signInWithPopup(provider)
    .then((userCredential) => {
      // User signed in successfully
      console.log(userCredential.user);
      // Redirect the user to the home page or some other page
    })
    .catch((error) => {
      // Handle errors
      console.error(error.code, error.message);
    });
});

// Add a click event listener to the Apple sign-in button
const appleSigninButton = document.getElementById('apple-signin');
appleSigninButton.addEventListener('click', () => {
  // Create a new Apple authentication provider
  const provider = new firebase.auth.OAuthProvider('apple.com');
  // Sign in the user with Apple
  firebase.auth().signInWithPopup(provider)
    .then((userCredential) => {
      // User signed in successfully
      console.log(userCredential.user);
      // Redirect the user to the home page or some other page
    })
    .catch((error) => {
      // Handle errors
      console.error(error.code, error.message);
    });
});
