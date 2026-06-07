
console.log("AUTH JS LOADED");

// LOGIN FUNCTION (GLOBAL)
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Missing email or password");
    return;
  }

  alert("Login clicked");

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login error: " + error.message);
    return;
  }

  window.location.href = "chat.html";
};

// GO TO SIGNUP
window.goSignup = function () {
  window.location.href = "signup.html";
};window.signup = async function () {
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
