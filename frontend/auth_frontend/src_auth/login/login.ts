
import { loginTemplate, sharedImage } from "./templates";
import { loginUser } from "./api";
import { navigate } from "../app";
import {socketInstance} from "../../../socket_manager/socket"
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
let currentUserId: string | null = null;

export function attachLoginHandlers() {
  const form = document.getElementById("login-form") as HTMLFormElement | null;
  const btn = document.getElementById("login-btn") as HTMLButtonElement | null;
  const signup = document.getElementById("login-signup");
  const forgot = document.getElementById("login-forgot");
  const googleBtn = document.getElementById("login-google");
  const githubBtn = document.getElementById("login-github");

  const usernameInput = document.getElementById("login-username") as HTMLInputElement | null;
  const passwordInput = document.getElementById("login-password") as HTMLInputElement | null;

  if (!form || !btn || !usernameInput || !passwordInput) return;

  if (signup) signup.addEventListener("click", () => navigate("/signup"));
  if (forgot) forgot.addEventListener("click", () => navigate("/forgot"));

  const togglePassword = document.getElementById("toggle-password");
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
      togglePassword.textContent =
        passwordInput.type === "password" ? "visibility" : "visibility_off";
    });
  }

  const submitLogin = async () => {
    clearError();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showError("Please fill all fields.");
      return;
    }

    try {
      const { response, body } = await loginUser(username, password);
      if (response && response.status === 206) {
        navigate("/verify?username=" + body.username);
        return  ;
      }
      if (body.success) {
        socketInstance();
        navigate("/home");
      } else {
        showError("Invalid username or password.");
      }
    } catch (err) {
      console.error(err);
      showError("Server error. Try again later.");
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitLogin();
  });

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    submitLogin();
  });

  if (googleBtn) {
    googleBtn.addEventListener("click", () => {
      window.location.href = "/api/auth/google";
    });
  }

  if (githubBtn) {
    githubBtn.addEventListener("click", () => {
      window.location.href = "/api/auth/github";
    });
  }
}

export { currentUserId };

