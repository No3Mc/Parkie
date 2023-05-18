document.addEventListener('DOMContentLoaded', function() {
  // Nav Responsive toggle button
  const toggleButton = document.getElementsByClassName('toggle-button')[0];
  const navbarLinks = document.getElementsByClassName('navbar-links')[0];

  toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
  });

  // To top button
  const mybutton = document.getElementById("myBtn");

  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function() {
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

  mybutton.addEventListener("click", function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  });

  const dailyParkingBtn = document.getElementById("daily-parking-btn");
  const loginModal = document.getElementById("loginModal");
  const closeButton = document.getElementsByClassName("close")[0];

  dailyParkingBtn.addEventListener("click", openLoginModal);
  closeButton.addEventListener("click", closeLoginModal);

function openLoginModal() {
  const isAuthenticated = dailyParkingBtn.getAttribute("data-authenticated");
  if (isAuthenticated === "false") {
    loginModal.style.display = "block";
  } else {
    // User is already logged in, perform appropriate action
    window.location.href = "{{ url_for('main') }}"; // Redirect to the main page
  }
}

  function closeLoginModal() {
    loginModal.style.display = "none";
  }

  // Hide the login modal initially if the user is already logged in
  if (current_user.is_authenticated) {
    loginModal.style.display = "none";
  }





});

