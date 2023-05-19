function sendMessage() {
    var userInput = document.getElementById("userInput");
    var message = userInput.value;

    if (message !== "") {
        displayMessage(message, "user");
        userInput.value = "";
        respondToMessage(message);
    }
}

function displayMessage(message, sender) {
    var chatOutput = document.getElementById("chatOutput");
    var newMessage = document.createElement("div");
    newMessage.classList.add(sender);
    newMessage.textContent = message;
    chatOutput.appendChild(newMessage);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function respondToMessage(message) {
    // Basic response logic
    var response = "I'm just a simple chatbot. I don't have much to say.";
    displayMessage(response, "bot");
}

function openChatbot() {
    var chatIframe = document.getElementById("chatIframe");
    chatIframe.src = "chatbot.html";
}
