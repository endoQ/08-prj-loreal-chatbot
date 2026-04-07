/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Conversation memory
let messages = [
  {
    role: "system",
    content:
      "You are a beauty assistant that ONLY answers questions about L’Oréal products, skincare routines, haircare, and makeup. If a question is unrelated, politely refuse and say you can only help with L’Oréal products and routines.",
  },
];

addMessage("ai", "👋 Hello! Ask me about L’Oréal products or routines!");

function addMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("msg", role);
  msgDiv.textContent = text;

  chatWindow.appendChild(msgDiv);

  // Auto-scroll to bottom
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value;

  addMessage("user", userMessage);

  messages.push({ role: "user", content: userMessage });

  userInput.value = "";

  // Show temporary "thinking..."
  const thinkingDiv = document.createElement("div");
  thinkingDiv.classList.add("msg", "ai");
  thinkingDiv.textContent = "Thinking...";
  chatWindow.appendChild(thinkingDiv);

  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    const response = await fetch(
      "https://twilight-snowflake-ac64.gurizar.workers.dev",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      },
    );

    const data = await response.json();

    const reply = data.choices[0].message.content;

    thinkingDiv.remove();

    addMessage("ai", reply);

    // Save to memory for context awareness
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    thinkingDiv.remove();
    addMessage("ai", "Error: " + err.message);
  }
});
