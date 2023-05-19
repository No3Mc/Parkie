document.addEventListener('DOMContentLoaded', function() {
  const chatContainer = document.getElementById('chat-container');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-btn');

  sendButton.addEventListener('click', function() {
    const userMessage = userInput.value;
    displayMessage(userMessage, 'user');
    generateReply(userMessage);
    userInput.value = '';
  });

  function displayMessage(message, sender) {
    const messageBox = document.createElement('div');
    messageBox.classList.add('message', sender);
    messageBox.textContent = message;
    chatContainer.appendChild(messageBox);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function generateReply(message) {
    let reply = '';
    if (message.includes('hello')) {
      reply = 'Hello there!';
    } else if (message.includes('how are you')) {
      reply = 'I am doing fine, thank you!';
    } else if (message.includes('bye')) {
      reply = 'Goodbye!';
    } else {
      reply = 'I'm sorry, I don't understand.';
    }
    displayMessage(reply, 'bot');
  }
});
