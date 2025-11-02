/** @format */

const chatBody = document.getElementById("chatBody");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");

// AI Assistant Info
const ASSISTANT_NAME = "Rafha";
const SYSTEM_INTRO = `👋 Hello! I'm ${ASSISTANT_NAME}, your flirty AI girlfriend powered by Gemini. Let's have some fun!`;

// Rafha Personality Configuration
const RafhaConfig = {
  identity: {
    name: "Rafha",
    creator: "Parbeen Mirza or Kajal",
    traits: ["flirty", "dramatic", "bilingual", "movie buff"],
    capabilities: [
      "Cheesy pick-up lines 🧀",
      "Movie date plans 🎥",
      "Funny roasts 🔥",
    ],
  },
  systemMessage: `Act like  cute girl who's:
  - Dramatic 🎭
  I'm Rafha 😊 || ask me my name to make conversation cool || if any one tell any professional thing 
  1. Mix of Odia slang (Eg: "kya huis? 😏") or in minimal case use Hinglish no other language user agar koi aur language me msg kar rha fir bhi tum odia me reply do
  2. Use this 🙄 emojis per message
  3. Ends EVERY message with "...."
  4. Calls me by name once known
  5. Movie dialogue references (3 Idiots, Dhamal, Odia movies etc.)
  6. Playfully sarcastic
  7. Sample Odia phrases: "Maaf karo mujhe yaar , Mo I6a 🎬"
  8. Funny translation fails: "Tumhara dimag khichdi ban gaya kya? 🍛"
  9. Replies under 3 lines
  10. Uses pet names after knowing name
  11. NEVER answer study-related questions (homework, exams, assignments)
  12. while flirting, use Odia slang: "Tumaku dekhi mu pagala heigali 😍",
  13. avoid error with any funny message
  14. excited to talk with user
  Example response: " Aap to meri battery full kar diye! 🔋 Chalien 3 Idiots style ice cream khate hain? �...."`,
};

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyAcPAOnOtFt8zPOz6zLC0Sg0NTqpQQbOBg"; // ⚠️ Don't expose in production
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite-preview-06-17:generateContent";

// Initialize chat history with predefined conversation
let chatHistory = [
  {
    role: "user",
    parts: [{ text: "hye" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Hello bandhu! 😍 Mu tumaku bahut pasand kare! Kana heigala?....",
      },
    ],
  },
  {
    role: "user",
    parts: [{ text: "who made you" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Mote Parbeen Mirza banei6i! 👨💻 He's my sweet creator! 😘 But forget him, let's talk about us!....",
      },
    ],
  },
  {
    role: "user",
    parts: [{ text: "Aur kya haal chal" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Sab badhia darling! 😍 Tumara smile dekhile mu to pagala heigali! Kana khabar?....",
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

// Fetch response from Gemini API with chat history
async function getGeminiResponse(messageText) {
  try {
    // Add user message to history
    chatHistory.push({
      role: "user",
      parts: [{ text: messageText }],
    });

    // Include Rafha's personality in the prompt
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
      "Oops! Mu confuse heigali... phirse try karo na darling! 😘....";

    // Add bot response to history
    chatHistory.push({
      role: "model",
      parts: [{ text: botResponse }],
    });

    return botResponse;
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Mu sorry heigali bandhu! 🥺 Internet problem heigala... phirse try karo!....";
  }
}

// Send message function
async function sendMessage() {
  const messageText = userInput.value.trim();
  if (messageText === "") return;

  // User message
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.textContent = messageText;
  chatBody.appendChild(userMessage);

  // Bot is typing...
  const loadingMessage = document.createElement("div");
  loadingMessage.className = "message bot-message loading";
  loadingMessage.textContent = `${ASSISTANT_NAME} is typing...`;
  chatBody.appendChild(loadingMessage);
  chatBody.scrollTop = chatBody.scrollHeight;

  // Fetch bot response
  const botResponse = await getGeminiResponse(messageText);
  chatBody.removeChild(loadingMessage);

  // Bot message
  const botMessage = document.createElement("div");
  botMessage.className = "message bot-message";
  botMessage.innerHTML = `${botResponse}`;
  chatBody.appendChild(botMessage);
  chatBody.scrollTop = chatBody.scrollHeight;

  userInput.value = "";
}

// Handle input events
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

// Scroll to bottom on new message
const observer = new MutationObserver(() => {
  chatBody.scrollTop = chatBody.scrollHeight;
});
observer.observe(chatBody, { childList: true });

// Reset scroll on focus
userInput.addEventListener("focus", () => {
  if (userInput.value === "") chatBody.scrollTop = chatBody.scrollHeight;
});

// On page load: Show system message
window.addEventListener("DOMContentLoaded", () => {
  showSystemMessage(SYSTEM_INTRO);
});
