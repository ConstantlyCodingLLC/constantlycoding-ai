import { supabase } from "./supabase.js";

const app = document.getElementById("app");

let state = {
  user: null,
  page: "loading",
  messages: []
};

// ----------------------
// ROUTER (NO RELOADS)
// ----------------------
function render() {
  if (state.page === "loading") return renderLoading();
  if (state.page === "login") return renderLogin();
  if (state.page === "chat") return renderChat();
}

// ----------------------
// INIT AUTH (NO FLICKER FIX)
// ----------------------
async function init() {
  const { data } = await supabase.auth.getUser();

  state.user = data.user;

  state.page = state.user ? "chat" : "login";

  render();
}

init();

// ----------------------
// LOADING SCREEN
// ----------------------
function renderLoading() {
  app.innerHTML = `
    <div class="h-screen flex items-center justify-center">
      <p class="text-gray-400">Loading...</p>
    </div>
  `;
}

// ----------------------
// LOGIN SCREEN
// ----------------------
function renderLogin() {
  app.innerHTML = `
    <div class="h-screen flex items-center justify-center">
      <div class="bg-gray-900 p-6 rounded w-96">
        <h1 class="text-xl mb-4">Login</h1>

        <input id="email" class="w-full p-2 mb-2 bg-gray-800 rounded" placeholder="Email">
        <input id="password" type="password" class="w-full p-2 mb-4 bg-gray-800 rounded" placeholder="Password">

        <button id="loginBtn" class="w-full bg-blue-500 p-2 rounded">
          Login
        </button>
      </div>
    </div>
  `;

  document.getElementById("loginBtn").onclick = login;
}

// ----------------------
// LOGIN LOGIC
// ----------------------
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  state.user = data.user;
  state.page = "chat";
  render();
}

// ----------------------
// CHAT SCREEN
// ----------------------
function renderChat() {
  app.innerHTML = `
    <div class="flex flex-col h-screen">

      <div class="p-3 bg-gray-900 flex justify-between">
        <span>AI SaaS Chat</span>
        <button id="logoutBtn" class="text-red-400">Logout</button>
      </div>

      <div id="chatBox" class="flex-1 p-3 overflow-y-auto"></div>

      <div class="p-3 bg-gray-900 flex gap-2">
        <input id="msg" class="flex-1 p-2 bg-gray-800 rounded">
        <button id="sendBtn" class="bg-blue-500 px-4 rounded">Send</button>
      </div>

    </div>
  `;

  document.getElementById("logoutBtn").onclick = logout;
  document.getElementById("sendBtn").onclick = sendMessage;

  loadMessages();
}

// ----------------------
// LOGOUT (NO REDIRECT LOOP)
// ----------------------
async function logout() {
  await supabase.auth.signOut();

  state.user = null;
  state.page = "login";

  render();
}

// ----------------------
// SEND MESSAGE
// ----------------------
async function sendMessage() {
  const text = document.getElementById("msg").value;
  if (!text) return;

  await supabase.from("chats").insert({
    user_id: state.user.id,
    message: text,
    sender: "user"
  });

  document.getElementById("msg").value = "";

  loadMessages();
}

// ----------------------
// LOAD CHAT MESSAGES
// ----------------------
async function loadMessages() {
  const { data } = await supabase
    .from("chats")
    .select("*")
    .order("created_at", { ascending: true });

  const box = document.getElementById("chatBox");
  if (!box) return;

  box.innerHTML = "";

  data.forEach(m => {
    const div = document.createElement("div");
    div.className = "p-2 my-1 rounded bg-gray-800 w-fit";
    div.innerText = m.message;
    box.appendChild(div);
  });
}
