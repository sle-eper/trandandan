// authSuccess.ts
import { navigate } from "../app";

export function handleOAuthSuccess() {
  // Example
  document.body.innerHTML = "<h1>Logging you in...</h1>";

  // Fetch the session from your backend
  fetch("/api/auth/google/callback", { credentials: "include" })
    .then(() => navigate("dashboard"));
}
