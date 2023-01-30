// test code


const notificationIcon = document.querySelector('.notification-icon');
const notificationDropdown = document.querySelector('.notification-dropdown');
const notifications = document.querySelector('#notifications');

notificationIcon.addEventListener('click', function() {
  if (notificationDropdown.style.display === 'block') {
    notificationDropdown.style.display = 'none';
  } else {
    notificationDropdown.style.display = 'block';
  }
});


const getNotifications = async () => {
  const response = await fetch('/Core/routes/CustDev/Noifs/Notifs.json');
  const notificationsList = await response.json();
  return notificationsList.notifications;
};


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

renderNotifications();








// test code



const menuIcon = document.querySelector(".menu-icon");
const menuDrawer = document.querySelector("#menu-drawer");


window.addEventListener("resize", function() {
  if (window.innerWidth <= 600) {
    menuIcon.style.display = "block";
  } else {
    menuIcon.style.display = "none";
  }
});


menuIcon.addEventListener("click", function() {
  console.log("Menu icon clicked"); 
  // testing the event listener bc work hi nahein kar raha.
  menuDrawer.classList.toggle("visible");
});


const profileCircle = document.querySelector(".profile-circle");
const dropdownContent = document.querySelector(".dropdown-content");

profileCircle.addEventListener("mouseover", function() {
  dropdownContent.classList.add("show");
});

dropdownContent.addEventListener("mouseover", function() {
  dropdownContent.classList.add("show");
});

dropdownContent.addEventListener("mouseout", function() {
  dropdownContent.classList.remove("show");
});

document.getElementById("botBT").addEventListener("click", function(event) {
  event.preventDefault(); 
  var botUrl = this.getAttribute("href");
  var iframe = document.createElement('iframe');
  iframe.src = botUrl;
  iframe.height = "500";
  iframe.width = "400";
  document.body.appendChild(iframe);
});


// "Multani Sohan Halwa";
// Not related to the code.

