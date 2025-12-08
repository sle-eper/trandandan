import { showMainUI } from "../../src/ts/script.ts"
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
  updateContent(`
    <h1 class="text-3xl font-bold">Home</h1>
    <p class="text-gray-400 mt-2">Welcome to your dashboard.</p>
  `);
}

export function loadChat() {
  // updateContent(`
  //   <h1 class="text-3xl font-bold">Chat</h1>
  //   <p class="text-gray-400 mt-2">Your messages appear here.</p>
  // `);
    showMainUI(14);
}

export function loadProfile() {
  updateContent(`
    <h1 class="text-3xl font-bold">Profile</h1>
    <p class="text-gray-400 mt-2">Your account settings.</p>
  `);
}
export function loadGame()
{
    updateContent(`
    <h1 class="text-3xl font-bold">game</h1>
    <p class="text-gray-400 mt-2">Your account settings.</p>
  `);
}
export function loadtournament()
{
    updateContent(`
    <h1 class="text-3xl font-bold">tournament</h1>
    <p class="text-gray-400 mt-2">Your account settings.</p>
  `);
}


