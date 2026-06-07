window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  alert("Signup button clicked"); // TEST 1

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) return alert(error.message);

  alert("Account created!");
  window.location.href = "index.html";
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  alert("Login clicked"); // TEST 1

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) return alert(error.message);

  window.location.href = "chat.html";
};
