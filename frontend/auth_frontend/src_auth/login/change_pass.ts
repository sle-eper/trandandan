import { ChangePass, mailsended, sharedImage} from "./templates";
import { navigate } from "../app";

export function showchangePassPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
      ${ChangePass()}
      ${sharedImage("signup-page")}
    </div>
  `;

  attachChangepassHandlers();
}
export function mailSendedPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
      ${mailsended()}
      ${sharedImage("signup-page")}
    </div>
  `;
}


function attachChangepassHandlers() {
  const btn = document.getElementById("change-btn") as HTMLButtonElement | null;
  const back = document.getElementById("change-back");

  // Back link → go to login page
  if (back) back.addEventListener("click", () => navigate("login"));

  if (!btn) return;

  btn.addEventListener("click", async () => {
    const urlParams = new URLSearchParams(window.location.search);

    // Extract the token
    const token = urlParams.get("token");
    const password = (document.getElementById("change-pass") as HTMLInputElement).value.trim();
    const confirm = (document.getElementById("change-confirm") as HTMLInputElement).value.trim();
    const restult = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ newPassword: password, confirmPassword: confirm, token })
    });
    console.log("Password changed successfully", restult);
    if (!password || !confirm || password !== confirm) {
      alert("Passwords must match and cannot be empty.");
      return;
    }
    if (restult.status === 200)
    {
      navigate("login");
    }
  });
}

