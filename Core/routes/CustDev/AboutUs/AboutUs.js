const button = document.querySelector("#learn-more");
const hiddenContent = document.querySelector("#hidden-content");

button.addEventListener("click", function() {
    if (hiddenContent.style.display === "none") {
        hiddenContent.style.display = "block";
        button.innerHTML = "Hide";
    } else {
        hiddenContent.style.display = "none";
        button.innerHTML = "Learn More";
    }
});
