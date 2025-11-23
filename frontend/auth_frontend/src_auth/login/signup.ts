// src/login/signup.ts
import { signupTemplate, sharedImage } from "./templates";
import { navigate } from "../app";
import { signupUser } from "./api"

export function showSignupPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
      ${signupTemplate()}
      ${sharedImage("signup-page")}
    </div>
  `;

  attachSignupHandlers();
}


function attachSignupHandlers() {
  const btn = document.getElementById("signup-btn") as HTMLButtonElement | null;
  const loginLink = document.getElementById("signup-login");
  if (loginLink) loginLink.addEventListener("click", () => navigate("login"));

  if (!btn) return;
  btn.addEventListener("click",async() => {
    const username = (document.getElementById("signup-username") as HTMLInputElement).value.trim();
    const email = (document.getElementById("signup-email") as HTMLInputElement).value.trim();
    const confirm = (document.getElementById("signup-confirm") as HTMLInputElement).value.trim();
    const password = (document.getElementById("signup-password") as HTMLInputElement).value.trim();

    if (!username || !email || !password || password !== confirm) {
      alert("Please fill fields correctly (email must match)");
      return;
    }
    const result = await signupUser(username , email , password , confirm);

    if (result.success) {
      console.log("Login success:", result);

      // show dashboard
      navigate("dashboard");
    } else {
      alert("Invalid username or password");
    }
  });
}
