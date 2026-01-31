import { handleOAuthSuccess } from "./auth_success";

export async function loginUser(username: string, password: string) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ username, password }),
    });
    const body = await response.json();
    return { response, body };
  } catch (err) {
    console.error(err);
    return { response: null, body: { success: false } };
  }
}

export async function signupUser(
  username: string,
  email: string,
  password: string,
  confirm: string
) {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ username, email, password, confirm }),
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}

// Forgot Password API
export async function forgotPass(email: string) {
  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
export async function fetchMatchHistory(userId: number) {
  const res = await fetch(`/api/game/history/${userId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch match history");
  }
  return res.json();
}
