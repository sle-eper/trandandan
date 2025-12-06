// login.ts
import { loginTemplate, sharedImage } from "./templates";
import { loginUser } from "./api";
import { navigate } from "../app";
// import { showDashboard } from "../dashboard/dashboard";
// import { showMainUI } from "../../src/ts/script.ts";

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
let currentUserId: string | null = null; // store user_id globally

export function attachLoginHandlers() {
  const btn = document.getElementById("login-btn") as HTMLButtonElement | null;
  const signup = document.getElementById("login-signup");
  const forgot = document.getElementById("login-forgot");
  const googleBtn = document.getElementById("login-google");
  const githubBtn = document.getElementById("login-github");

  if (signup) signup.addEventListener("click", () => navigate("signup"));
  if (forgot) forgot.addEventListener("click", () => navigate("forgot"));

  if (!btn) return;

  btn.addEventListener("click", async () => {
    const username = (document.getElementById("login-username") as HTMLInputElement).value.trim();
    const password = (document.getElementById("login-password") as HTMLInputElement).value.trim();

    if (!username || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const { response, body } = await loginUser(username, password);

      if (body.success) {
        // ✅ Read user_id from headers if backend sends it
        currentUserId = response?.headers.get("x-user-id") || null;

        console.log("Login success:", body, "User ID:", currentUserId);

        navigate("dashboard");
      } else {
        alert(body.message || "Invalid username or password");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  });

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      window.location.href = "http://localhost:8080/api/auth/google";
    });
  }

  if (githubBtn) {
    githubBtn.addEventListener("click", () => {
      window.location.href = "http://localhost:8080/api/auth/github";
    });
  }
}

export { currentUserId };

