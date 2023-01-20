var button = document.getElementById("my-button");
var text = document.getElementById("my-text");

button.addEventListener("click", function() {
  text.innerHTML = "Multani Sohan Halwa";
});


var mailme = function() {
  console.log('Caught!');
}

window.addEventListener('error', function(e) {
  var ie = window.event || {};
  var errMsg = e.message || ie.errorMessage || "404 error on " + window.location;
  var errSrc = (e.filename || ie.errorUrl) + ': ' + (e.lineno || ie.errorLine);
  mailme([errMsg, errSrc]);
}, true);