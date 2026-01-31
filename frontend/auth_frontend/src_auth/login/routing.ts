
import { showMainUI } from "../../../chat-frontend/src/ts/script.ts"
import { show2FAPage } from "./2FA.ts"
import { showHome } from "./home.ts";
import { games } from "./games.ts";
import { Tournament } from "../../../tournament_frontend/src/create_tournament.ts"
import { PlayerProfileManager } from "../../../profile_frontend/src/components/FriendRequest.ts";

export function updateContent(html: string) {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  // Fade out
  content.classList.add("opacity-0");

  setTimeout(() => {
    // Replace HTML after fade-out
    content.innerHTML = html;

    // Fade back in
    content.classList.remove("opacity-0");
  }, 250); // must match your CSS transition time
}
export function loadHome() {
  showHome();
}

export function loadChat() {
  showMainUI();
}

export function loadProfile() {
  const profilePage = new PlayerProfileManager();
  profilePage.showPlayerProfile();
}
export function loadGame(type?: string) {
  games(type);
}

export function loadtournament() {
  Tournament();
}
export function load2FA() {
  show2FAPage();
}


