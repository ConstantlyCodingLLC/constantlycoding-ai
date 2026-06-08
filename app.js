// ---------- AUTH / NAV ----------
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Enter login info");

  localStorage.setItem("user", email);
  window.location.href = "chat.html";
}

function signup() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Fill all fields");

  localStorage.setItem("user", email);
  alert("Account created!");
  window.location.href = "chat.html";
}

function resetPassword() {
  const email = document.getElementById("email").value;
  if (!email) return alert("Enter email");

  alert("Password reset link sent (mock)");
  window.location.href = "index.html";
}

function guest() {
  localStorage.setItem("user", "Guest_" + Math.floor(Math.random() * 10000));
  window.location.href = "chat.html";
}

// ---------- CHAT ----------
function loadMessages() {
  const box = document.getElementById("chatBox");
  if (!box) return;

  const msgs = JSON.parse(localStorage.getItem("msgs") || "[]");
  box.innerHTML = "";

  msgs.forEach(m => {
    const div = document.createElement("div");
    div.className = "bg-gray-700 p-2 rounded";
    div.innerText = m.user + ": " + m.text;
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value;
  if (!text) return;

  const user = localStorage.getItem("user") || "Guest";

  const msgs = JSON.parse(localStorage.getItem("msgs") || "[]");
  msgs.push({ user, text });

  localStorage.setItem("msgs", JSON.stringify(msgs));

  input.value = "";
  loadMessages();
}

// auto load chat
window.onload = () => {
  loadMessages();
};let user = null;

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
