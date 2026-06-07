async function sendMessage() {
  const input = document.getElementById("input");
  const chatBox = document.getElementById("chatBox");

  const text = input.value.trim();
  if (!text) return;

  chatBox.innerHTML += `
    <div class="bg-blue-600/20 p-3 rounded-xl ml-auto w-fit">
      ${text}
    </div>
  `;

  input.value = "";

  // placeholder instantly (FEELS FAST)
  const aiBubbleId = "ai-" + Date.now();

  chatBox.innerHTML += `
    <div id="${aiBubbleId}" class="bg-slate-800 p-3 rounded-xl w-fit">
      Thinking...
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
      temperature: 0.4,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content: `
You are a fast, clear AI assistant.

Rules:
- Keep responses short unless asked
- Use bullet points when helpful
- Be direct and structured
- No fluff or long intros
          `
        },
        { role: "user", content: text }
      ]
    })
  });

  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content || "Error generating response";

  document.getElementById(aiBubbleId).innerHTML = reply;

  chatBox.scrollTop = chatBox.scrollHeight;
}