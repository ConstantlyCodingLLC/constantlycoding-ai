let user = null;

async function init() {
  const { data } = await supabaseClient.auth.getUser();
  user = data.user;

  if (!user) {
    window.location.href = "index.html";
  }
}

init();

function addMessage(text, type) {
  const box = document.getElementById("messages");

  const div = document.createElement("div");
  div.className = "msg " + (type === "user" ? "user" : "ai");
  div.innerText = text;

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// CHECK LIMIT
async function canSend() {
  const today = new Date().toISOString().split("T")[0];

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (profile.plan === "pro") return true;

  const { data: usage } = await supabaseClient
    .from("daily_usage")
    .select("*")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .single();

  if (usage && usage.message_count >= 25) {
    alert("Daily limit reached (25 messages). Upgrade to Pro.");
    return false;
  }

  return true;
}

// SEND MESSAGE
async function send() {
  const input = document.getElementById("input");
  const text = input.value.trim();
  if (!text) return;

  if (!(await canSend())) return;

  addMessage(text, "user");
  input.value = "";

  const reply = "AI response placeholder (connect OpenAI next)";

  addMessage(reply, "ai");

  // update usage
  const today = new Date().toISOString().split("T")[0];

  const { data: usage } = await supabaseClient
    .from("daily_usage")
    .select("*")
    .eq("user_id", user.id)
    .eq("usage_date", today)
    .single();

  if (usage) {
    await supabaseClient
      .from("daily_usage")
      .update({ message_count: usage.message_count + 1 })
      .eq("id", usage.id);
  } else {
    await supabaseClient.from("daily_usage").insert({
      user_id: user.id,
      message_count: 1
    });
  }
}