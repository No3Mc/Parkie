// test code








// test code


// Select the notification icon, dropdown, and the container for the notifications
const notificationIcon = document.querySelector('.notification-icon');
const notificationDropdown = document.querySelector('.notification-dropdown');
const notifications = document.querySelector('#notifications');

// Add click event listener to toggle the display of the notification dropdown
notificationIcon.addEventListener('click', function() {
  if (notificationDropdown.style.display === 'block') {
    notificationDropdown.style.display = 'none';
  } else {
    notificationDropdown.style.display = 'block';
  }
});

// Function to get the notifications from the JSON file
const getNotifications = async () => {
  const response = await fetch('/Core/routes/CustDev/Noifs/Notifs.json');
  const notificationsList = await response.json();
  return notificationsList.notifications;
};

// Function to render the notifications in the UI
const renderNotifications = async () => {
  const notificationsList = await getNotifications();
  notificationsList.forEach((notification) => {
    const li = document.createElement('li');
    li.innerHTML = notification.title;
    li.addEventListener('click', function() {
      window.location.href = notification.url;
    });
    notifications.appendChild(li);
  });
};

// Call the function to render the notifications
renderNotifications();

// Select the menu icon and the menu drawer
const menuIcon = document.querySelector(".menu-icon");
const menuDrawer = document.querySelector("#menu-drawer");

// Add event listener to handle the display of the menu icon based on the screen size
window.addEventListener("resize", function() {
  if (window.innerWidth <= 600) {
    menuIcon.style.display = "block";
  } else {
    menuIcon.style.display = "none";
  }
});

// Add click event listener to toggle the visibility of the menu drawer
menuIcon.addEventListener("click", function() {
  menuDrawer.classList.toggle("visible");
});

// Select the profile circle and the dropdown content
const profileCircle = document.querySelector(".profile-circle");
const dropdownContent = document.querySelector(".dropdown-content");

// Add mouseover event listener to show the dropdown content
profileCircle.addEventListener("mouseover", function() {
  dropdownContent.classList.add("show");
});

// Add mouseover event listener to show the dropdown content
dropdownContent.addEventListener("mouseover", function() {
  dropdownContent.classList.add("show");
});

// Add mouseout event listener to hide the dropdown content
dropdownContent.addEventListener("mouseout", function() {
  dropdownContent.classList.remove("show");
});

// document.getElementById("botBT").addEventListener("click", function(event) {
//   event.preventDefault(); 
//   var botUrl = this.getAttribute("href");
//   var iframe = document.createElement('iframe');
//   iframe.src = botUrl;
//   iframe.height = "500";
//   iframe.width = "400";
//   document.body.appendChild(iframe);
// });


// "Multani Sohan Halwa";
// Not related to the code.

