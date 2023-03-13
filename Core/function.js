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
      
      




      // // Get the login button element
      // const loginButton = document.getElementById('login-button');

      // // Add an event listener to the login button to prevent default behavior
      // loginButton.addEventListener('click', (event) => {
      //   event.preventDefault();
      // });

      // routes/CustDev/LogReg/login.html