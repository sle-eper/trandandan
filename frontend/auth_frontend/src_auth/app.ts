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

import { initRouter, addRoute, navigate } from "./login/router";
import { showLandingPage } from "./login/landing";
import { showLoginPage } from "./login/login";
import { showSignupPage } from "./login/signup";
import { showForgotPage } from "./login/forgot_pass";
import { showDashboard } from "./dashboard/dashboard";
import { showchangePassPage } from "./login/change_pass";
import { handleOAuthSuccess } from "./login/auth_success";
import { showNotFound } from "./login/not_found";
import { loadHome, loadGame, loadtournament, loadProfile, loadChat } from "./login/routing";


// Register all routes
addRoute("/", () => showLandingPage());
addRoute("/landing", () => showLandingPage());
addRoute("/login", () => showLoginPage());
addRoute("/signup", () => showSignupPage());
addRoute("/forgot", () => showForgotPage());
addRoute("/dashboard", () => showDashboard());
addRoute("/change", () => showchangePassPage());
addRoute("/auth/success", () => handleOAuthSuccess());
addRoute("/dashboard", () => showDashboard());

// Dashboard sub-pages
addRoute("/home", () => {
    showDashboard();   // ensures the dashboard layout is loaded
    loadHome();        // loads Home content
});

addRoute("/game", () => {
    showDashboard();
    loadGame();
});
addRoute("/chat", () => {
    showDashboard();
    loadChat();
});
addRoute("/tournament", () => {
    showDashboard();
    loadtournament();
});

addRoute("/profile", () => {
    showDashboard();
    loadProfile();
});

// Start router
window.addEventListener("DOMContentLoaded", () => {
  initRouter(() => showNotFound());
});

export { navigate };




