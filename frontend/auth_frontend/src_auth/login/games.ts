import { gamesTemplate } from "./templates.ts";
import { spyUi } from "../../../spy_frontend/src_spy/app.ts"
import { initializeGame, animate } from "../../../game_frontend/src_game/src/main.ts";
export function games(type?: string) {
  const main = document.getElementById("dashboard-content");
  if (!main) return;

  // 👇 GAME SELECTION PAGE
  if (!type) {
    main.innerHTML = gamesTemplate();
    return;
  }

  // 👇 SPY GAME
  if (type === "spy") {
    main.innerHTML = `<div id="spy-root" class="w-full h-full"></div>`;
    spyUi("local");
    return;
  }

  // 👇 PONG GAME
  if (type === "pong") {
    main.innerHTML = `
      <div id="pong-root" class="w-full h-full flex items-center justify-center">
        <div id="game-lobby" class="max-w-4xl w-full p-8 rounded-3xl bg-[#1a1a1d]/50 backdrop-blur-xl border border-white/10 shadow-2xl animate-fade-in">
          <h2 class="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Choose Your Match</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <!-- Local Friend -->
            <button id="btn-friend" class="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative z-10 flex flex-col items-center gap-4">
                <span class="material-symbols-outlined text-4xl text-cyan-400">groups</span>
                <span class="text-lg font-semibold text-white">Versus Friend</span>
                <p class="text-xs text-white/50 text-center">Play locally on the same keyboard</p>
              </div>
            </button>

            <!-- Local AI -->
            <button id="btn-ai" class="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative z-10 flex flex-col items-center gap-4">
                <span class="material-symbols-outlined text-4xl text-purple-400">smart_toy</span>
                <span class="text-lg font-semibold text-white">Versus AI</span>
                <p class="text-xs text-white/50 text-center">Practice against a computer opponent</p>
              </div>
            </button>

            <!-- Remote -->
            <button id="btn-remote" class="group relative overflow-hidden p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative z-10 flex flex-col items-center gap-4">
                <span class="material-symbols-outlined text-4xl text-green-400">public</span>
                <span class="text-lg font-semibold text-white">Online Match</span>
                <p class="text-xs text-white/50 text-center">Create a room and invite a friend</p>
              </div>
            </button>
          </div>

          <div class="flex justify-center flex-col items-center gap-4">
            <div id="join-section" class="hidden w-full max-w-sm animate-slide-up">
               <div class="flex gap-2">
                 <input type="text" id="join-id" placeholder="Enter Match ID..." class="flex-grow px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:border-cyan-500 outline-none transition-all">
                 <button id="btn-join" class="px-6 py-3 bg-cyan-600 rounded-xl font-bold hover:bg-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/50">Join</button>
               </div>
            </div>
            <button id="toggle-join" class="text-sm text-white/40 hover:text-white transition-colors underline-offset-4 hover:underline">Or join an existing match with ID</button>
          </div>
        </div>

        <div id="game-container" class="hidden w-full max-w-5xl animate-fade-in">
          <div id="game-info" class="text-white mb-6 text-center font-mono bg-white/5 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10 mx-auto max-w-md shadow-xl transition-all duration-500"></div>
          <div class="canvas-container w-full"></div>
        </div>
      </div>`;

    // Initialize the Pong game and start animation loop
    const ok = initializeGame();
    if (ok) {
      animate();
    }
    return;
  }
}
