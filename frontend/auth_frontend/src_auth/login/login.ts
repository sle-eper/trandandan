// login.ts
import { loginTemplate, sharedImage } from "./templates";
import { navigate } from "../app";
import { loginUser } from "./api";
// import { showDashboard } from "../dashboard/dashboard";
import { showMainUI } from "../../src/ts/script.ts";

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
  // console.log(body);
  // console.log(response.headers)
  // Read headers from the REAL response
  // const user = response.headers.get("x-user");
  // const userId = response.headers.get("x-user-id");

  // console.log("Header username:", user);
  const userId = response.headers.get('x-user-id')
  console.log("Header userId:", userId);

    showMainUI(userId);
    } else {
      alert("Invalid username or password");
    }
  });
}
