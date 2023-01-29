// test code




const menuDrawer = document.getElementById("menu-drawer");
const screenWidth = window.innerWidth;

if (screenWidth < 600) {
  menuDrawer.style.display = "block";
} else {
  menuDrawer.style.display = "none";
}
window.addEventListener("resize", function() {
  const screenWidth = window.innerWidth;

  if (screenWidth < 600) {
    menuDrawer.style.display = "block";
  } else {
    menuDrawer.style.display = "none";
  }
});






// test code


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

