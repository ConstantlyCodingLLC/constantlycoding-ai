async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "chat.html";
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Check your email to confirm account");
}