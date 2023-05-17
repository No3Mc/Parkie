// Nav Responsive toggle button
const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]

toggleButton.addEventListener('click', () => {
  navbarLinks.classList.toggle('active')
})

// To top button

      //Get the button:
      mybutton = document.getElementById("myBtn");
    

      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function () {
        scrollFunction();
      };
  
      function scrollFunction() {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }
  
      myBtn.addEventListener("click", function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      })


  const mainLink = document.getElementById("main-link");

  function toggleMainLink() {
    mainLink.classList.toggle("disabled");
  }

  // Add an event listener to the main link
  if (mainLink) {
    mainLink.addEventListener("click", function(event) {
      if (mainLink.classList.contains("disabled")) {
        event.preventDefault();
        alert("Please login to access this page.");
      }
    });
  }




      const chatIframe = document.getElementById('chatIframe');

      function openChatbot() {
        chatIframe.style.display = 'block';
      }
      
      // Add a click event listener to the close button inside the chat iframe
      chatIframe.addEventListener('load', () => {
        const closeButton = chatIframe.contentWindow.document.getElementById('close-button');
        closeButton.addEventListener('click', () => {
          chatIframe.style.display = 'none';
        });
      });
      







  function openLoginForm() {
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "block";
  }
     

    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const guestButton = document.getElementById('guest-button');
    const loginSubmitButton = document.getElementById('login-submit');

    function showLoginForm() {
      loginForm.style.display = 'block';
    }
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', showLoginForm);
    function handleLoginFormSubmit(event) {
      event.preventDefault(); // Prevent the default form submission behavior
      const username = usernameInput.value;
      const password = passwordInput.value;


    loginSubmitButton.addEventListener('click', handleLoginFormSubmit);
    }
