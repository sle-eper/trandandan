import { ChangePass, sharedImage } from "./templates";
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
function attachChangepassHandlers() {
  const btn = document.getElementById("change-btn") as HTMLButtonElement | null;
  const back = document.getElementById("change-back");

  // Back link → go to login page
  if (back) back.addEventListener("click", () => navigate("login"));

  if (!btn) return;

  btn.addEventListener("click", async () => {
    const password = (document.getElementById("change-pass") as HTMLInputElement).value.trim();
    const confirm = (document.getElementById("change-confirm") as HTMLInputElement).value.trim();

    if (!password || !confirm || password !== confirm) {
      alert("Passwords must match and cannot be empty.");
      return;
    }

    // TODO → call your backend API
    // Example:
    // const result = await changePassword(password);

    // Simulated success:
    alert("Password changed successfully!");
    navigate("login");
  });
}
