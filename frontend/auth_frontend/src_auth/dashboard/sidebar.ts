// import { navigate } from "../app";

// We keep your UI EXACTLY the same — only add href + data-route attributes

export function renderSidebar(): string {
  return `
    <div id="layout" class="hidden md:flex justify-center items-center h-[calc(90vh-3rem)] w-30">
      <aside id="sidebar" class="bg-red-600 h-[65%] w-[50%] rounded-3xl">
        <nav class="flex flex-col justify-around h-full items-center">

          <a href="/home" data-route>
            <span id="btn-home" class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              home
            </span>
          </a>

          <a href="/game" data-route>
            <span id="btn-game" class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              stadia_controller
            </span>
          </a>

          <a href="/chat" data-route>
            <span id="btn-chat" class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              chat
            </span>
          </a>

          <a href="/tournement" data-route>
            <span id="btn-tourn" class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              rewarded_ads
            </span>
          </a>

          <a href="/profile" data-route>
            <span id="btn-profile" class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              account_circle
            </span>
          </a>
        </nav>
      </aside>
    </div>
  `;
}


// Only highlight active item — NO loading content here
export function sidebarLogic() {
  const path = window.location.pathname;

  const map: Record<string, string> = {
    "/home": "btn-home",
    "/game": "btn-game",
    "/chat": "btn-chat",
    "/tournement": "btn-tourn",
    "/profile": "btn-profile",
  };

  const active = map[path];

  if (active) {
    const el = document.getElementById(active);
    if (el) {
      el.classList.add("text-red-400"); // simple highlight
    }
  }
}
