// src/login/signup.ts
import { signupTemplate, sharedImage } from "./templates";
import { navigate } from "../app";
import { signupUser } from "./api";

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
function showSignupError(msg: string) {
  const box = document.getElementById("signup-error");
  if (!box) return;
  box.textContent = msg;
  box.classList.remove("opacity-0");
  box.classList.add("opacity-100");
}

function clearSignupError() {
  const box = document.getElementById("signup-error");
  if (!box) return;
  box.textContent = "";
  box.classList.remove("opacity-100");
  box.classList.add("opacity-0");
}

function attachSignupHandlers() {
  const btn = document.getElementById("signup-btn") as HTMLButtonElement | null;
  const loginLink = document.getElementById("signup-login");

  const usernameInput = document.getElementById("signup-username") as HTMLInputElement | null;
  const emailInput = document.getElementById("signup-email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("signup-password") as HTMLInputElement | null;
  const confirmInput = document.getElementById("signup-confirm") as HTMLInputElement | null;

  if (loginLink) loginLink.addEventListener("click", () => navigate("login"));
  if (!btn || !usernameInput || !emailInput || !passwordInput || !confirmInput) return;

  const submitSignup = async () => {
    clearSignupError();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirm = confirmInput.value.trim();

    if (!username || !email || !password || !confirm) {
      showSignupError("Please fill all fields.");
      return;
    }

    if (password !== confirm) {
      showSignupError("Passwords do not match.");
      return;
    }

    try {
      const result = await signupUser(username, email, password, confirm);

      if (result.success) {
        navigate("/dashboard"); // ✅ go to login on success
      } else {
        showSignupError(result.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);
      showSignupError("Server error. Try again later.");
    }
  };

  btn.addEventListener("click", submitSignup);

  // ⌨️ ENTER KEY SUPPORT
  const handleEnter = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitSignup();
    }
  };

  usernameInput.addEventListener("keydown", handleEnter);
  emailInput.addEventListener("keydown", handleEnter);
  passwordInput.addEventListener("keydown", handleEnter);
  confirmInput.addEventListener("keydown", handleEnter);

  // 👁 Password visibility toggles (already added before)
    // 👁 PASSWORD VISIBILITY TOGGLE
  const togglePassword = document.getElementById("toggle-signup-password");
  const toggleConfirm = document.getElementById("toggle-signup-confirm");

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePassword.textContent = isHidden ? "visibility_off" : "visibility";
    });
  }

  if (toggleConfirm && confirmInput) {
    toggleConfirm.addEventListener("click", () => {
      const isHidden = confirmInput.type === "password";
      confirmInput.type = isHidden ? "text" : "password";
      toggleConfirm.textContent = isHidden ? "visibility_off" : "visibility";
    });
  }

}
