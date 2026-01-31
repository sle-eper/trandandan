import { navigate } from "../app";
export function handleOAuthSuccess() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    document.body.innerHTML = "<h1>OAuth failed</h1>";
    return;
  }

  localStorage.setItem("token", token);

  try {
    document.cookie = `token=${token}; path=/; SameSite=Lax;`;
  } catch (e) {
    console.warn('Could not set cookie for token', e);
  }
  navigate("/home");
}

