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

  // Also set a cookie so legacy code and fetch requests using credentials include can send it
  // Note: this is not HttpOnly; for production consider setting cookie server-side with HttpOnly + Secure
  try {
    document.cookie = `token=${token}; path=/; SameSite=Lax;`;
  } catch (e) {
    console.warn('Could not set cookie for token', e);
  }

  // Load dashboard
  navigate("/home");
}

