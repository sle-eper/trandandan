// import { showMainUI } from "../../src/ts/script.ts"
import { showMainUI } from "../../../chat-frontend/src/ts/script.ts"
// import { ProfileApp } from "../../profile_frontend/src/main.ts";
// import { ProfileApp } from "../../../profile_frontend/src/main.ts";
import{ ProfileForm } from "../../../profile_frontend/src/components/ProfileForm.ts"
// import { spyUi } from "../../src_spy/app.ts"
import { show2FAPage } from "./2FA.ts"
import { showHome } from "./home.ts";
import { games } from "./games.ts";
// import sss from "../images/ping.png"
// import { currentUserId }? from "./login.ts"
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
  // updateContent(`
  //   <h1 class="text-3xl font-bold">Home</h1>
  //   <p class="text-gray-400 mt-2">Welcome to your dashboard.</p>
  // `);
  showHome();
}

export function loadChat() {
    showMainUI();
}

export function loadProfile() {
  // updateContent(`
  //   <h1 class="text-3xl font-bold">Profile</h1>
  //   <p class="text-gray-400 mt-2">Your account settings.</p>
  // `);
  const profileForm = new ProfileForm();
  profileForm.mount('dashboard-content');

}
export function loadGame(type?: string) {
  games(type);
}

export function loadtournament()
{
    updateContent(`
    <h1 class="text-3xl font-bold">tournament</h1>
    <p class="text-gray-400 mt-2">Your account settings.</p>
  `);
}
export function load2FA()
{
  // updateContent(`
  //   <h1 class="text-3xl font-bold">2FA</h1>
  //   <p class="text-gray-400 mt-2">Your account settings.</p>
  // `);
  show2FAPage();
}


