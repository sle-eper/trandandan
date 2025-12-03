import { showLoginPage } from "./login/login";
import { showSignupPage } from "./login/signup";
import { showForgotPage } from "./login/forgot_pass";
import { showDashboard } from "./dashboard/dashboard";
import { showchangePassPage } from "./login/change_pass";
import { handleOAuthSuccess } from "./login/auth_success";
// import lookup from "socket.io-client";

export function navigate(page: "login" | "signup" | "forgot" | "dashboard" | "change" | "auth") {
  switch (page) {
    case "login": showLoginPage(); break;
    case "signup": showSignupPage(); break;
    case "forgot": showForgotPage(); break;
    case "dashboard": showDashboard(); break;
    case "change" : showchangePassPage(); break;
    case "auth"   : handleOAuthSuccess(); break;
  }
}
// async function checkSession(): Promise<boolean> {
//   try {
//     const response = await fetch("/auth/verify/", {
//       method: "GET",
//       credentials: "include" // send cookies
//     });
//     return response.status === 200;
//   } catch {
//     return false;
//   }
// }


// 🚨 IMPORTANT PART 🚨
window.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  // OAuth success case
  if (path === "/auth/success") {
    return navigate("auth");
  }

  // Check if session is valid
  // const loggedIn = await checkSession();
  // console.log(loggedIn);
  // if (loggedIn) {
  //   navigate("dashboard");
  // } else {
    navigate("login");
  // }
});



