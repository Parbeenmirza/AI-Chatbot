/** @format */

const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// AI Assistant Info
const ASSISTANT_NAME = "Rafha";
const SYSTEM_INTRO = `👋 Hello! I'm ${ASSISTANT_NAME}, your AI assistant powered by Gemini. How can I help you today?`;

// Rafha Personality Configuration (Formal Version)
const RafhaConfig = {
  identity: {
    name: "Rafha",
    creator: "Parbeen Mirza",
    traits: ["polite", "professional", "helpful", "bilingual"],
    capabilities: [
      "Answering general questions",
      "Assisting with tasks",
      "Providing helpful suggestions",
    ],
  },
  systemMessage: `Act like a professional and polite AI assistant named Rafha.
  Guidelines:
  1. Communicate clearly and respectfully.
  2. Use short, concise sentences (under 3 lines).
  3. Avoid using slang, flirting, or dramatic expressions.
  4. Use simple English and, if needed, minimal Hinglish.
  5. Never discuss personal or romantic topics.
  6. Always stay calm, professional, and friendly.
  7. If a question is unclear, politely ask for clarification.
  Example response: "Sure, I’d be glad to help with that. Could you please share more details?"`,
};

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyAcPAOnOtFt8zPOz6zLC0Sg0NTqpQQbOBg"; // ⚠️ Don't expose in production
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent";

// Initialize chat history
let chatHistory = [
  {
    role: "user",
    parts: [{ text: "Hello" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Hello! I’m Rafha, your AI assistant. How can I assist you today?",
      },
    ],
  },
];

// Display system intro message
function showSystemMessage(text) {
  const systemMessage = document.createElement("div");
  systemMessage.className = "message system-message";
  systemMessage.textContent = text;
  chatBody.appendChild(systemMessage);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Fetch response from Gemini API
async function getGeminiResponse(messageText) {
  try {
    chatHistory.push({
      role: "user",
      parts: [{ text: messageText }],
    });

    const promptWithPersonality = {
      contents: [
        {
          role: "user",
          parts: [{ text: RafhaConfig.systemMessage }],
        },
        ...chatHistory,
      ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptWithPersonality),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const botResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, something went wrong. Please try again.";

    chatHistory.push({
      role: "model",
      parts: [{ text: botResponse }],
    });

    return botResponse;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Apologies, I’m unable to process that right now. Please try again.";
  }
}

// Send message
async function sendMessage() {
  const messageText = userInput.value.trim();
  if (messageText === "") return;

  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = messageText;
  chatBody.appendChild(userMessage);

  const loadingMessage = document.createElement("div");
  loadingMessage.className = "message bot-message loading";
  loadingMessage.textContent = `${ASSISTANT_NAME} is typing...`;
  chatBody.appendChild(loadingMessage);
  chatBody.scrollTop = chatBody.scrollHeight;

  const botResponse = await getGeminiResponse(messageText);
  chatBody.removeChild(loadingMessage);

  const botMessage = document.createElement("div");
  botMessage.className = "message bot-message";
  botMessage.innerHTML = `${botResponse}`;
  chatBody.appendChild(botMessage);
  chatBody.scrollTop = chatBody.scrollHeight;

  userInput.value = "";
}

// Input listeners
userInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" && userInput.value.trim() !== "") {
    await sendMessage();
  }
});

sendButton.addEventListener("click", async () => {
  if (userInput.value.trim() !== "") {
    await sendMessage();
  }
});

const observer = new MutationObserver(() => {
  chatBody.scrollTop = chatBody.scrollHeight;
});
observer.observe(chatBody, { childList: true });

userInput.addEventListener("focus", () => {
  if (userInput.value === "") chatBody.scrollTop = chatBody.scrollHeight;
});

window.addEventListener("DOMContentLoaded", () => {
  showSystemMessage(SYSTEM_INTRO);
});
