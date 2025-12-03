// login.ts
import { loginTemplate, sharedImage } from "./templates";
import { loginUser } from "./api";
import { navigate } from "../app";
// import { showDashboard } from "../dashboard/dashboard";

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
let currentUserId: string | null = null; // store user_id globally if needed
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
      const result = await loginUser(username, password);

      if (result.success) {
        // Optionally store user_id globally
        currentUserId = result.user_id || null; 
        console.log("Login success:", result);

        // Navigate to dashboard
        navigate("dashboard");
      } else {
        alert(result.message || "Invalid username or password");
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

// Export the current user ID if needed in other modules
export { currentUserId };

