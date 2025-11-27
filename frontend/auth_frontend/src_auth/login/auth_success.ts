// authSuccess.ts
import { navigate } from "../app";

export function handleOAuthSuccess() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    alert("OAuth failed");
    return;
  }

  // store the user session
  localStorage.setItem("token", token);

  // redirect to dashboard
  navigate("dashboard");
}
