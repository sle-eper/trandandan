import axios from "axios";
import { navigate } from "../app";
import { PlayerSearch } from "./playerSearch";




export function renderNavBar(): string {
  return `
    <nav id="nav-bar"
      class="w-full flex items-center justify-between 
             px-6 py-2 rounded-3xl sticky top-0 z-50 bg-[#111]">

      <!-- Logo -->
      <div class="flex items-center gap-3">
          <img src="/src_auth/images/pingponglogo.jpg" alt="logo" class="w-12 h-12 rounded-lg"/>
        <span class="text-xl font-bold tracking-wide drop-shadow-sm">
          PingPong
        </span>
      </div>

      <!-- Search Bar -->
      <div class="flex-1 max-w-md mx-8 relative group">
        <div class="relative flex items-center">
          <span class="material-symbols-outlined
                absolute left-3 text-white/70 pointer-events-none">
            search
          </span>
          <input 
            type="text" 
            id="player-search"
            placeholder="Search for players..."
            class="w-full pl-10 pr-4 py-2 rounded-full
                   bg-black/10 border border-white/20 backdrop-blur-lg
                   text-white placeholder-white/50
                   focus:outline-none focus:border-[#FD1D1D] focus:bg-black/20
                   transition-all duration-300"
          />
        </div>
        
        <!-- Search Results Dropdown -->
        <div id="search-results" 
             class="hidden absolute top-full mt-2 w-full rounded-xl
                    bg-black/90 border border-white/10 shadow-xl backdrop-blur-xl
                    max-h-80 overflow-y-auto">
          <!-- Results will be populated here -->
        </div>
      </div>

      <div class="flex items-center gap-4 relative">

        <button id="notification-btn"
          class="w-10 h-10 flex items-center justify-center rounded-full
                 border border-white/20 bg-white/10 backdrop-blur-lg
                 transition-all duration-300 hover:scale-110
                 hover:bg-[#FD1D1D]/20 hover:border-[#FD1D1D]
                 hover:shadow-[0_0_12px_#FD1D1D,0_0_22px_#711F21]">
          <span class="material-symbols-outlined text-white text-[24px]">
            notifications
          </span>
        </button>

        <button id="settings-btn"
          class="w-10 h-10 flex items-center justify-center rounded-full
                 border border-white/20 bg-white/10 backdrop-blur-lg
                 transition-all duration-300 hover:scale-110
                 hover:bg-[#FD1D1D]/20 hover:border-[#FD1D1D]
                 hover:shadow-[0_0_12px_#FD1D1D,0_0_22px_#711F21]">
          <span class="material-symbols-outlined text-white text-[24px]">
            settings
          </span>
        </button>

        <div id="settings-menu"
          class="hidden absolute right-0 top-12 w-48 rounded-xl bg-black/70
                 border border-white/10 shadow-xl backdrop-blur-xl
                 py-2 opacity-0 translate-y-[-6px]
                 transition-all duration-200 ease-out">

          <button id="change-account"
            class="w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                   transition rounded-lg">
            Change Account
          </button>

          <button id="enable-2fa"
            class="w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                   transition rounded-lg">
            Enable 2FA
          </button>

          <button id="sign-out"
            class="w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                   transition rounded-lg">
            Sign Out
          </button>

        </div>

        <!-- Profile -->
        <button id="profile"
          class="w-10 h-10 flex items-center justify-center rounded-full
                 border border-white/20 bg-white/10 backdrop-blur-lg
                 transition-all duration-300 hover:scale-110
                 hover:bg-[#FD1D1D]/20 hover:border-[#FD1D1D]
                 hover:shadow-[0_0_15px_#FD1D1D,0_0_25px_#711F21]">
          <span class="material-symbols-outlined text-white text-[26px]">
            account_circle
          </span>
        </button>

      </div>

    </nav>
  `;
}

export async function navBarLogic() {
  const btn = document.getElementById("settings-btn");
  const menu = document.getElementById("settings-menu");
  const signOutBtn = document.getElementById("sign-out");
  const profile = document.getElementById("profile");
  const searchInput = document.getElementById('player-search') as HTMLInputElement;
  const searchResults = document.getElementById('search-results') as HTMLDivElement;
  const changeAccountBtn = document.getElementById("change-account");
  const enable2FABtn = document.getElementById("enable-2fa");

  // Toggle settings menu
  btn?.addEventListener("click", () => {
    if (!menu) return;

    const isHidden = menu.classList.contains("hidden");

    if (isHidden) {
      // OPEN MENU
      menu.classList.remove("hidden");
      setTimeout(() => {
        menu.classList.remove("opacity-0", "translate-y-[-6px]");
        menu.classList.add("opacity-100", "translate-y-0");
      }, 10);
    } else {
      // CLOSE MENU
      menu.classList.add("opacity-0", "translate-y-[-6px]");
      menu.classList.remove("opacity-100", "translate-y-0");
      setTimeout(() => menu.classList.add("hidden"), 150);
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!btn?.contains(e.target as Node) && !menu?.contains(e.target as Node)) {
      menu?.classList.add("opacity-0", "translate-y-[-6px]");
      menu?.classList.remove("opacity-100", "translate-y-0");
      setTimeout(() => menu?.classList.add("hidden"), 150);
    }
  });

  // ✅ SIGN OUT BUTTON
  signOutBtn?.addEventListener("click", async () => {
    document.body.classList.add("flex", "items-center", "justify-center", "px-6", "md:px-20");
    navigate("login");
  });

  // ✅ PROFILE NAV
  profile?.addEventListener("click", async () => {
    navigate("profile");
  });

  // ✅ CHANGE ACCOUNT
  changeAccountBtn?.addEventListener("click", () => {
    document.body.classList.add("flex", "items-center", "justify-center", "px-6", "md:px-20");
    navigate("login");
  });

  // ✅ ENABLE 2FA
  enable2FABtn?.addEventListener("click", () => {
    navigate("/2FA"); // assuming you have a 2FA page
  });

   const playerSearch = new PlayerSearch(searchInput, searchResults);
  await playerSearch.loadPlayersFromAPI();
  playerSearch.initializeEventListeners();
}
