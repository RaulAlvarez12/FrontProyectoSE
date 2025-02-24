const urlNgrok = 'https://d018-177-93-4-104.ngrok-free.app/chat';


// Carousel functionality
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  let currentSlide = 0;
  
  // Create dots
  slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
  });

  function updateDots() {
      document.querySelectorAll('.dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
      });
  }

  function goToSlide(n) {
      currentSlide = n;
      carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
      updateDots();
  }

  function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      goToSlide(currentSlide);
  }

  function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      goToSlide(currentSlide);
  }

  document.querySelector('.next').addEventListener('click', nextSlide);
  document.querySelector('.prev').addEventListener('click', prevSlide);

  // Auto-advance slides every 5 seconds
  setInterval(nextSlide, 5000);

const chatWidget = document.getElementById("chatWidget");
const chatHeader = document.getElementById("chatHeader");
const minimizeBtn = document.getElementById("minimizeBtn");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");



// Toggle chat window
chatHeader.addEventListener("click", () => {
  chatWidget.classList.toggle("minimized");
  chatWidget.classList.toggle("expanded");
  minimizeBtn.textContent = chatWidget.classList.contains("minimized")
    ? "+"
    : "−";
});

/* Send message function
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    // Add user message
    addMessage(message, "sent");

    // Simulate response (you can replace this with actual chatbot logic)
    setTimeout(() => {
      const responses = [
        "I understand. Tell me more.",
        "That's interesting! How can I help?",
        "I see what you mean.",
        "Could you elaborate on that?",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, "received");
    }, 1000);

    messageInput.value = "";
  }
}
 */
// Función para generar un user_id único
function generateUniqueUserId() {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Revisar si ya existe un user_id en localStorage, sino generarlo
let userId = localStorage.getItem('user_id');
if (!userId) {
  userId = generateUniqueUserId();
  localStorage.setItem('user_id', userId);
}

// Función para enviar el mensaje al backend
async function sendMessage() {
  const inputElement = messageInput;
  const message = inputElement.value.trim();
  if (message === "") return;
  
  // Limpiar el input
  inputElement.value = '';

  // Datos a enviar al backend
  const data = {
    user_id: userId,
    message: message
  };

  // Realiza la petición POST al backend.
  // Reemplaza la URL por la URL pública de ngrok si es necesario.
  const response = await fetch(urlNgrok, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  console.log("Respuesta del backend:", result);

  // Actualiza el historial de chat en el frontend
  addMessage(message, "sent");
  addMessage(result.response, "received");
  // const chatHistory = document.getElementById('chat-history');
  // chatHistory.innerHTML += `<div class="message"><span class="user"><strong>Usuario:</strong></span> ${message}</div>`;
  // chatHistory.innerHTML += `<div class="message"><span class="bot"><strong>Chatbot:</strong></span> ${result.response}</div>`;
  
  // Opcional: desplazar el historial para ver el último mensaje
  // chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Add message to chat
function addMessage(text, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send button click handler
sendButton.addEventListener("click", sendMessage);

// Enter key handler
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});


});