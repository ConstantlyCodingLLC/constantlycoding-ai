let messageCount = 0;
const FREE_LIMIT = 25;

async function sendMessage() {
  const input = document.getElementById("msg");
  const chat = document.getElementById("chat");

  const text = input.value;
  if (!text) return;

  // LIMIT CHECK
  if (messageCount >= FREE_LIMIT) {
    alert("Free limit reached. Upgrade to Pro ($21.99)");
    return;
  }

  messageCount++;

  // USER MESSAGE
  chat.innerHTML += `
    <div class="bg-blue-600/20 p-3 rounded-xl w-fit ml-auto">
      ${text}
    </div>
  `;

  input.value = "";

  // CALL API
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  });

  const data = await res.json();

  // AI RESPONSE
  chat.innerHTML += `
    <div class="bg-slate-800 p-3 rounded-xl w-fit">
      ${data.reply}
    </div>
  `;
}