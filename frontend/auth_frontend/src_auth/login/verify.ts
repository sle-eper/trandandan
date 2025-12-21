import { verifyTemplate, sharedImage } from "./templates";
import { navigate } from "../app";

export function showverifyPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
      ${verifyTemplate()}
      ${sharedImage("signup-page")}
    </div>
  `;

  attachVerifyHandlers();
}

function showError(msg: string) {
  const errorBox = document.getElementById("verify-error");
  if (!errorBox) return;
  errorBox.textContent = msg;
  errorBox.classList.remove("opacity-0");
  errorBox.classList.add("opacity-100");
}

function clearError() {
  const errorBox = document.getElementById("verify-error");
  if (!errorBox) return;
  errorBox.textContent = "";
  errorBox.classList.remove("opacity-100");
  errorBox.classList.add("opacity-0");
}

export function attachVerifyHandlers() {
  const inputs = Array.from(
    document.querySelectorAll<HTMLInputElement>(".verify-input")
  );
  const btn = document.getElementById("verify-btn") as HTMLButtonElement | null;

  if (!inputs.length || !btn) return;

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      clearError();
      input.value = input.value.replace(/[^0-9]/g, "");

      if (input.value && inputs[index + 1]) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && inputs[index - 1]) {
        inputs[index - 1].focus();
      }

      if (e.key === "Enter") {
        e.preventDefault();
        submitCode();
      }
    });
  });

  const submitCode = () => {
    clearError();
    const code = inputs.map(i => i.value).join("");

    if (code.length !== inputs.length) {
      showError("Please enter the complete verification code.");
      return;
    }

    // 🚧 MOCK verification (replace later with API)
    if (code !== "123456") {
      showError("Invalid verification code.");
      return;
    }

    // ✅ Success → go to login
    navigate("login");
  };

  btn.addEventListener("click", submitCode);
}

