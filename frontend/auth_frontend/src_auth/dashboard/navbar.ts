import { navigate } from "../app";
export function renderNavBar(): string {
  return `
    <nav id="nav-bar"
      class="w-full flex items-center justify-between 
             px-6 py-2 rounded-3xl sticky top-0 z-50 bg-[#111]">

      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="rounded-xl p-1 bg-white/10 shadow-inner backdrop-blur-md">
          <img src="/src_auth/images/pingponglogo.jpg" alt="logo" class="w-12 h-12 rounded-lg"/>
        </div>
        <span class="text-xl font-bold tracking-wide drop-shadow-sm">
          PingPong
        </span>
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

          <button id="sign-out"
            class="w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                   transition rounded-lg">
            Sign Out
          </button>

        </div>

        <!-- Profile -->
        <button id = "profile"
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

export function navBarLogic() {
  const btn = document.getElementById("settings-btn");
  const menu = document.getElementById("settings-menu");
  const signOutBtn = document.getElementById("sign-out");
  const profile = document.getElementById("profile");

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
    // Optional: clear cookies/localStorage here
    // For example, if you had a token in localStorage:
    // localStorage.removeItem("token");

    // Call backend logout route if exists (optional)
    // try {
    //   await fetch("/api/auth/logout", {
    //     method: "POST",
    //     credentials: "include", // send cookie to invalidate on backend
    //   });
    // } catch (err) {
    //   console.warn("Logout request failed", err);
    // }

    // Navigate to login page
    navigate("login");
  });
  profile?.addEventListener("click", async () =>
  {
    navigate("profile");
  });
}


