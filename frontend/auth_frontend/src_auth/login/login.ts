// login.ts
import { loginTemplate, sharedImage } from "./templates";
import { loginUser } from "./api";
import { navigate } from "../app";
// import { showDashboard } from "../dashboard/dashboard";
// import { showMainUI } from "../../src/ts/script.ts";
function showError(msg: string) {
  const errorBox = document.getElementById("login-error");
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.add("opacity-100");
}

function clearError() {
  const errorBox = document.getElementById("login-error");
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.classList.remove("opacity-100");
}

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

  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("login-password") as HTMLInputElement;

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.textContent = "visibility_off";
      } else {
        passwordInput.type = "password";
        togglePassword.textContent = "visibility";
      }
    });
  }


  if (!btn) return;

  btn.addEventListener("click", async () => {
  clearError();

  const username = (document.getElementById("login-username") as HTMLInputElement).value.trim();
  const password = (document.getElementById("login-password") as HTMLInputElement).value.trim();

  if (!username || !password) {
    showError("Please fill all fields.");
    return;
  }

  try {
    const { response, body } = await loginUser(username, password);

    if (body.success) {
      currentUserId = response?.headers.get("x-user-id") || null;
      navigate("dashboard");
    } else {
      showError(body.message || "Invalid username or password.");
    }

  } catch (err) {
    console.error(err);
    showError("Server error. Try again later.");
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

