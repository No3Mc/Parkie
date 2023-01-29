// test code













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

