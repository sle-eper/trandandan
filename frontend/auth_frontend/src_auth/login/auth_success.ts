import { navigate } from "../app";
export function handleOAuthSuccess() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    document.body.innerHTML = "<h1>OAuth failed</h1>";
    return;
  }

  // Save token
  localStorage.setItem("token", token);

  // Load dashboard
  navigate("dashboard");
}

