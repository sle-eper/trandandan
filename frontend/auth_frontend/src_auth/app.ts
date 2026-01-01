


import { initRouter, addRoute, navigate } from "./login/router";
import { showLandingPage } from "./login/landing";
import { showLoginPage } from "./login/login";
import { showSignupPage } from "./login/signup";
import { showForgotPage } from "./login/forgot_pass";
import { showDashboard } from "./dashboard/dashboard";
import { showchangePassPage } from "./login/change_pass";
import { handleOAuthSuccess } from "./login/auth_success";
import { showNotFound } from "./login/not_found";
import { loadHome, loadGame, loadtournament, loadProfile, loadChat , load2FA } from "./login/routing";
import { showverifyPage } from "./login/verify";
// import { spyUi } from "../../src_spy/app.ts"
import { spyUi } from "../../spy_frontend/src_spy/app.ts"

async function protectedRoute(
  handler: () => void
) {
  const isLoggedIn = await checkSession();

  if (!isLoggedIn) {    
    navigate("/login");
    return;
  }
  handler();
}
async function checkSession(): Promise<boolean> {
  try {
    const response = await fetch("/auth/verify", {
      method: "GET",
      credentials: "include", // send cookies
    });
    console.log("=--------------------------------", response);
    return response.ok;
  } catch {
    return false;
  }
}

// Register all routes
addRoute("/", () => showLandingPage());
addRoute("/landing", () => showLandingPage());
addRoute("/login", () => showLoginPage());
addRoute("/signup", () => showSignupPage());
addRoute("/forgot", () => showForgotPage());
addRoute("/change", () => showchangePassPage());
addRoute("/auth/success", () => handleOAuthSuccess());
addRoute("/verify", () => showverifyPage());

addRoute("/home", () =>
  protectedRoute(() => {
    showDashboard();
    loadHome();
  })
);

addRoute("/game", () =>
  protectedRoute(() => {
    showDashboard();
    loadGame();

    document.getElementById("spy-render")?.addEventListener("click", () => {
      spyUi();
    });
  })
);

addRoute("/chat", () =>
  protectedRoute(() => {
    showDashboard();
    loadChat();
  })
);

addRoute("/tournament", () =>
  protectedRoute(() => {
    showDashboard();
    loadtournament();
  })
);

addRoute("/profile", () =>
  protectedRoute(() => {
    showDashboard();
    loadProfile();
  })
);

addRoute("/2FA", () =>
  protectedRoute(() => {
    showDashboard();
    load2FA();
  })
);

// Start router
window.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = await checkSession();

  const protectedPaths = [
    "/home",
    "/game",
    "/chat",
    "/profile",
    "/tournament",
    "/2FA"
  ];

  const currentPath = window.location.pathname;

  if (!isLoggedIn && protectedPaths.includes(currentPath)) {
    navigate("/login");
    return;
  }

  initRouter(() => showNotFound());
});


export { navigate };




