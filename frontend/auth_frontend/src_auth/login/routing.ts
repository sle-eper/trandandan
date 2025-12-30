// import { showMainUI } from "../../src/ts/script.ts"
import { showMainUI } from "../../../chat-frontend/src/ts/script.ts"
// import { ProfileApp } from "../../profile_frontend/src/main.ts";
// import { ProfileApp } from "../../../profile_frontend/src/main.ts";
import{ ProfileForm } from "../../../profile_frontend/src/components/ProfileForm.ts"
// import { spyUi } from "../../src_spy/app.ts"
import { show2FAPage } from "./2FA.ts"
import { showHome } from "./home.ts";
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
function games()
{

  const main = document.getElementById("dashboard-content");
  if(main)
  {
    // console.log("ssssssss",window.location.pathname);
    // <img src="../images/ping.png" >
    main.innerHTML = `
    
    <div class="min-h-screen w-full flex flex-col justify-center items-center p-6">
    
    <h1 class="text-4xl md:text-5xl font-bold text-white mb-12 flex items-center justify-center gap-4">
      <span class="material-symbols-outlined text-5xl text-yellow-500">gamepad</span>
      Choose a game
    </h1>

    <div class="flex flex-col md:flex-row gap-8 w-full max-w-4xl">

        <div id="pingpong-render" class="group relative w-full h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer   duration-300 hover:scale-[1.02] ring-2 ring-transparent hover:ring-green-500">
            <div  class=" absolute inset-0 bg-gradient-to-br from-green-900 to-black">
                <img src="" 
                    class="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110  duration-700" alt="Ping Pong">
            </div>
            
            <div class="absolute inset-0 flex flex-col justify-center items-center z-10 p-4">
                <div class="items-center justify-center flex bg-green-600/20 p-6 rounded-full mb-4 group-hover:bg-green-500/30 transition-colors">
                    <span class="material-symbols-outlined text-6xl text-white">sports_tennis</span>
                </div>
                <h2 class="text-3xl font-bold text-white tracking-wider uppercase">Ping Pong</h2>
                <p class="text-green-200 mt-2 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0  duration-500">
                    Classic Table Tennis
                </p>
            </div>
        </div>

        <div id="spy-render" class="group relative w-full h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer   duration-300 hover:scale-[1.02] ring-2 ring-transparent hover:ring-red-500">
            <div class="absolute inset-0 bg-gradient-to-br from-red-900 to-black">
                <img src="" 
                    class="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110  duration-700" alt="Spy Game">
            </div>
            
            <div class="absolute inset-0 flex flex-col justify-center items-center z-10 p-4">
                <div class="flex items-center justify-center bg-red-600/20 p-6 rounded-full mb-4 group-hover:bg-red-500/30 transition-colors">
                    <span class="material-symbols-outlined text-6xl text-white">visibility_off</span>
                </div>
                <h2 class="text-3xl font-bold text-white tracking-wider uppercase">Spy Game</h2>
                <p class="text-red-200 mt-2 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0  duration-500">
                    Find the Imposter
                </p>
            </div>
        </div>

    </div>
</div> `
    
  }
  // return`
  
  // `
}
export function loadGame()
{

  games()


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


