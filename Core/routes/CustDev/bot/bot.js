function openChatbot() {
    const chatWindow = window.open('http://127.0.0.1:8000/chatbot/', '', 'width=400,height=400');
    const form = chatWindow.document.createElement('form');
    const input = chatWindow.document.createElement('input');
    input.type = 'text';
    input.name = 'message';
    form.appendChild(input);
    chatWindow.document.body.appendChild(form);
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const message = event.target.elements.message.value;
      fetch('http://127.0.0.1:8000/chatbot/', {
        method: 'POST',
        body: new FormData(event.target),
      })
        .then(response => response.json())
        .then(data => {
          const response = data.response;
          chatWindow.document.write(response);
        })
        .catch(error => console.error(error));
    });
  }
  