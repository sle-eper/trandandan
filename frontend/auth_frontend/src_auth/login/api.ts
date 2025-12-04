export async function loginUser(username: string, password: string) {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const body = await response.json();

    // return BOTH  and body
    return { response, body };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
}
export async function signupUser(
  username: string,
  email: string,
  password: string,
  confirm: string
) {
  console.log("data", username, email, password);
  try {
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirm }),
    });
    console.log("success");
    return await response.json();
  } catch (err) {
    console.log(`hnaa`);
    console.error(err);
    return { success: false };
  }
}
export async function forgotPass(email: string) {
  try {
    const response = await fetch("http://localhost:8080/login", {
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
