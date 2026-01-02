// src/login/forgot.ts
import { forgotTemplate, sharedImage } from "./templates";
import { navigate } from "../app";

export function showForgotPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
      ${forgotTemplate()}
      ${sharedImage("forgot-page")}
    </div>
  `;

  attachForgotHandlers();
}

function attachForgotHandlers() {
  const btn = document.getElementById("forgot-btn") as HTMLButtonElement | null;
  const signupLink = document.getElementById("forgot-signup");
  if (signupLink) signupLink.addEventListener("click", () => navigate("signup"));

  if (!btn) return;
  btn.addEventListener("click",async () => {
    const email = (document.getElementById("forgot-email") as HTMLInputElement).value.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }

    // TODO: call reset API -> then navigate
    //send request to backend 
  
    navigate("change");
  });
}
