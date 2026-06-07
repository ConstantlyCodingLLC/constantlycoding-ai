let user = null;

async function init() {
  const { data } = await supabaseClient.auth.getUser();
  user = data.user;

  if (!user) {
    window.location.href = "index.html";
  }
}

init();

function add(text, type) {
  const box = document.getElementById("msgs");

  const div = document.createElement("div");
  div.className = "msg " + (type === "user" ? "user" : "ai");
  div.innerText = text;

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function send() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  add(text, "user");
  input.value = "";

  // placeholder AI (we’ll connect real AI next)
  const reply = "AI is ready (next step: OpenAI backend)";

  add(reply, "ai");
}