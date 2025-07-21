const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// Simulated AI responses
const responses = [
  "That's an interesting question!",
  "Let me think about that...",
  "Cool! Tell me more!",
  "I'm here to help! What's next?",
  "Got it! Anything else?",
  "I'm learning every day! What can I do for you?",
  "Fascinating! Let's explore that further.",
];

// Send message function
function sendMessage() {
  const messageText = userInput.value.trim();
  if (messageText === "") return;

  // Add user message
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = messageText;
  chatBody.appendChild(userMessage);

  // Simulate bot response
  setTimeout(() => {
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.textContent =
      responses[Math.floor(Math.random() * responses.length)];
    chatBody.appendChild(botMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 500);

  userInput.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Event listeners
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && userInput.value.trim() !== "") {
    sendMessage();
  }
});

sendButton.addEventListener("click", () => {
  if (userInput.value.trim() !== "") {
    sendMessage();
  }
});

// Auto-scroll to bottom on new messages
const observer = new MutationObserver(() => {
  chatBody.scrollTop = chatBody.scrollHeight;
});
observer.observe(chatBody, { childList: true });

// Clear input on focus
userInput.addEventListener("focus", () => {
  if (userInput.value === "") chatBody.scrollTop = chatBody.scrollHeight;
});
