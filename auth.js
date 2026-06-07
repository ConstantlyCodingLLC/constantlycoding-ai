
console.log("AUTH JS LOADED");

// WAIT UNTIL PAGE LOADS
document.addEventListener("DOMContentLoaded", () => {

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  // LOGIN BUTTON
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      alert("Login clicked");

      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        alert(error.message);
        return;
      }

      window.location.href = "chat.html";
    });
  }

  // SIGNUP NAV BUTTON
  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }

});
