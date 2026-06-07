let messageCount = 0;
const FREE_LIMIT = 25;

function addMessage(text, type) {
  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `
    <div class="${type === 'user'
      ? 'bg-blue-600/20 ml-auto'
      : 'bg-white/10'} p-3 rounded-xl w-fit bubble">
      ${text}
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  if (messageCount >= FREE_LIMIT) {
    alert("Upgrade to Pro ($10.99/month) for unlimited access.");
    return;
  }

  messageCount++;

  addMessage(text, "user");
  input.value = "";

  // LIVE “thinking” bubble
  const id = "ai-" + Date.now();

  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML += `
    <div id="${id}" class="bg-white/10 p-3 rounded-xl w-fit bubble">
      typing...
    </div>
  `;

  chatBox.scrollTop = chatBox.scrollHeight;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CONFIG.OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `
You are AI Pro Assistant.

Rules:
- Be clear and structured
- Use bullets when helpful
- Keep responses fast and direct
- No long intros
          `
        },
        { role: "user", content: text }
      ]
    })
  });

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content || "Error";

  document.getElementById(id).innerHTML = reply;
}

function openSettings() {
  document.getElementById("settings").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settings").classList.add("hidden");
}

function setTheme(color) {
  document.body.style.setProperty("--bg", color);
}