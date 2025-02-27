document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
  
    // URL del backend
    const backendUrl = 'https://d002-201-202-14-98.ngrok-free.app/chat';
  
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
  
    function createUserMessage(text) {
      const messageContainer = document.createElement('div');
      messageContainer.className = 'message sent';
      messageContainer.textContent = text;
      return messageContainer;
    }
  
    function createAssistantMessage(text) {
      const messageContainer = document.createElement('div');
      messageContainer.className = 'message received';
      messageContainer.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a class="chat-link" href="$1" target="_blank">$1</a>');
      return messageContainer;
    }
  
    function createTypingIndicator() {
      const messageContainer = document.createElement('div');
      messageContainer.className = 'message received';
      messageContainer.id = 'typing-indicator';
      messageContainer.textContent = " Pensando...";
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
  
        if (!response.ok) throw new Error('Las respuesta de la red no fue Ok');
  
        const result = await response.json();
        removeTypingIndicator();
        chatMessages.appendChild(createAssistantMessage(result.response));
        scrollToBottom();
      } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        chatMessages.appendChild(createAssistantMessage("Perdón, estoy teniendo problemas de conexión. Por favor intenta de nuevo."));
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
  });
  