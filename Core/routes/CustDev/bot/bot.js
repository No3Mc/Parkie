const chatLog = document.querySelector('#chat-log');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');

chatForm.addEventListener('submit', event => {
  event.preventDefault();

  const message = chatInput.value.trim();

  if (message === '') {
    return;
  }

  appendMessage('You', message);
  chatInput.value = '';

  setTimeout(() => {
    let response;

    if (message.toLowerCase() === 'hi') {
      response = 'Hello!';
    } else if (message.toLowerCase() === 'hello') {
      response = 'Hi there!';
    } else {
      response = "I'm sorry, I didn't understand.";
    }

    appendMessage('Chatbot', response);
  }, 500);
});

function appendMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = `
    <span class="sender">${sender}:</span>
    <span class="message-text">${message}</span>
  `;
  chatLog.appendChild(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}
