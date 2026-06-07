let messageCount = 0;
const FREE_LIMIT = 25;

function addMessage(text, type) {
  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML += `
    <div class="${type === 'user'
      ? 'bg-blue-600/20 ml-auto'
      : 'bg-white/10'} p-3 rounded-xl w-fit max-w-[85%]">
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
    alert("Free limit reached. Upgrade to Pro.");
    return;
  }

  messageCount++;

  addMessage(text, "user");
  input.value = "";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer YOUR_OPENAI_KEY`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: "You are a fast, clean AI assistant. Be clear and structured."
        },
        { role: "user", content: text }
      ]
    })
  });

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content || "Error";

  addMessage(reply, "assistant");
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}