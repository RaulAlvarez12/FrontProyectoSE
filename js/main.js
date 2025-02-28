document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');

  // URL del backend
  const backendUrl = 'https://f78d-177-93-4-104.ngrok-free.app/chat';

  function generateUniqueUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
  }

  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = generateUniqueUserId();
    localStorage.setItem('user_id', userId);
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Función para reemplazar "\n" por <br>
  function convertNewlines(text) {
    return text.replace(/\n/g, '<br>');
  }

  function createUserMessage(text) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message sent';
    // Convertir saltos de línea en <br>
    messageContainer.innerHTML = convertNewlines(text);
    return messageContainer;
  }

  function createAssistantMessage(text) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message received';
    // Primero convertir links y luego saltos de línea
    let processedText = text.replace(/(https?:\/\/[^\s]+)/g, '<a class="chat-link" href="$1" target="_blank">$1</a>');
    processedText = convertNewlines(processedText);
    messageContainer.innerHTML = processedText;
    return messageContainer;
  }

  function createTypingIndicator() {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message received';
    messageContainer.id = 'typing-indicator';
    messageContainer.textContent = "Thinking...";
    return messageContainer;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.value = '';
    chatMessages.appendChild(createUserMessage(message));
    scrollToBottom();

    chatMessages.appendChild(createTypingIndicator());
    scrollToBottom();

    chatInput.disabled = true;
    sendButton.disabled = true;

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message })
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      removeTypingIndicator();
      chatMessages.appendChild(createAssistantMessage(result.response));
      scrollToBottom();
    } catch (error) {
      console.error('Error:', error);
      removeTypingIndicator();
      chatMessages.appendChild(createAssistantMessage("Sorry, I'm having trouble connecting. Please try again."));
      scrollToBottom();
    } finally {
      chatInput.disabled = false;
      sendButton.disabled = false;
      chatInput.focus();
    }
  }

  sendButton.addEventListener('click', sendMessage);

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 200)}px`;
  });

  chatInput.focus();

  setTimeout(() => {
    chatMessages.appendChild(createAssistantMessage("¡Hola! 👋 Soy AuraBot, tu asistente virtual del Recinto de Paraíso de la UCR. Estoy aquí para ayudarte con todo lo que necesites. Puedo asistirte con temas como contacto, oferta académica, vida estudiantil, proyectos, administración y mucho más. ¿Cómo puedo ayudarte hoy? 😊"));
    scrollToBottom();
  }, 500);
});
