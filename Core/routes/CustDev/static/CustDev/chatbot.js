function openChatbot() {
    var chatBtn = document.getElementById('chatBtn');
    var chatIframe = document.getElementById('chatIframe');

    chatBtn.style.display = 'none';
    chatIframe.src = 'http://localhost:8000/';  // Replace with the appropriate URL of your Django bot

    chatIframe.onload = function() {
        chatIframe.style.display = 'block';
    };
}

