


import { initRouter, addRoute, navigate } from "./login/router";
import { showLandingPage } from "./login/landing";
import { showLoginPage } from "./login/login";
import { showSignupPage } from "./login/signup";
import { showForgotPage } from "./login/forgot_pass";
import { showDashboard } from "./dashboard/dashboard";
import { showchangePassPage, mailSendedPage} from "./login/change_pass";
import { handleOAuthSuccess } from "./login/auth_success";
import { showNotFound } from "./login/not_found";
import { loadHome, loadGame, loadtournament, loadProfile, loadChat , load2FA } from "./login/routing";
import { showverifyPage } from "./login/verify";
import { spyUi } from "../../spy_frontend/src_spy/app";
import { renderCreateTournament } from "../../tournament_frontend/src/create_tournament";
import { renderTournamentList } from "../../tournament_frontend/src/create_tournament";

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
  if (window.location.pathname === "/login" || window.location.pathname === "/signup" || window.location.pathname === "/change" || window.location.pathname === "/2factor" || window.location.pathname  ==="/mailsended") {
    return true; // No need to check session on public pages
  }
  try {
    const response = await fetch("/auth/verify", {
      method: "GET",
      credentials: "include", // send cookies
    });
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
addRoute("/mailsended", () => mailSendedPage());
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
    loadGame(); // shows Choose a Game
  })
);

addRoute("/game/:type", (params) =>
  protectedRoute(() => {
    showDashboard();
    loadGame(params?.type);
  })
);

addRoute("/game/spy/:step", (params) =>
  protectedRoute(() => {
    showDashboard();
    spyUi(params?.step);
  })
);
addRoute("/game/spy/win_page/:step", (params) =>
  protectedRoute(() => {
    showDashboard();
    // game.innerHTML = renderSpyChoice(params?.step)
    // spyUi(params?.step);
  })
);



addRoute("/chat", () =>
  protectedRoute(() => {
    showDashboard();
    loadChat();
  })
);
// addRoute("/chat/:username", (params) =>
//   protectedRoute(() => {
//     showDashboard();
//     showMainUI();
//   })
// );


addRoute("/tournement", () =>
  protectedRoute(() => {
    showDashboard();
    loadtournament();
  })
);
addRoute("/tournement/list", () =>
  protectedRoute(() => {
    showDashboard();
    renderTournamentList();
  })
);

addRoute("/tournement/create", () =>
  protectedRoute(() => {
    showDashboard();
    renderCreateTournament();
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
    "/tournement",
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