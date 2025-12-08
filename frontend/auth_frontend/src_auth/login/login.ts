// login.ts
import { loginTemplate, sharedImage } from "./templates";
import { loginUser } from "./api";
import { navigate } from "../app";
// import { showDashboard } from "../dashboard/dashboard";
import { showMainUI } from "../../src/ts/script.ts";
// import {ProfileApp} from "../../../profile_frontend/src/main.ts";
export function showLoginPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
      ${loginTemplate()}
      ${sharedImage("login-page")}
    </div>
    `;

  attachLoginHandlers();
}

function attachLoginHandlers() {
  const btn = document.getElementById("login-btn") as HTMLButtonElement | null;
  const signup = document.getElementById("login-signup");
  const forgot = document.getElementById("login-forgot");
  const googleBtn = document.getElementById("login-google");
  const githubBtn = document.getElementById("login-github");

  if (signup) signup.addEventListener("click", () => navigate("signup"));
  if (forgot) forgot.addEventListener("click", () => navigate("forgot"));

  if (!btn) return;

  // ⬅️ FIXED: async handler because we use await
  btn.addEventListener("click", async () => {
    const username = (
      document.getElementById("login-username") as HTMLInputElement
    ).value.trim();
    const password = (
      document.getElementById("login-password") as HTMLInputElement
    ).value.trim();

    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    // ----------- CALL BACKEND -----------
    const { response, body } = await loginUser(username, password);

    // Body first
    if (body.success && response) {
      const res = await fetch("http://localhost:8080/auth/verify", {
        method: "GET",
        credentials: "include"
      });
      const bd = await res.json();
      // const socket = io("https://localhost:8080/", { withCredentials: true });
      showMainUI(bd.id);
    } else {
      alert("Invalid username or password");
    }
  });

  if (googleBtn)
    googleBtn.addEventListener("click", async () => {
      try {
        // Your backend route
        window.location.href = "http://localhost:8080/api/auth/google";
      } catch (err) {
        console.error(err);
      }
    });
  if (githubBtn)
    githubBtn.addEventListener("click", async () => {
      try {
        // Your backend route
        window.location.href = "http://localhost:8080/api/auth/github";
      } catch (err) {
        console.error(err);
      }
    });
}

