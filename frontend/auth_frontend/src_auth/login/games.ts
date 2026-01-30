import { gamesTemplate } from "./templates.ts";
import { spyUi } from "../../../spy_frontend/src_spy/app.ts"
import { initializeGame, animate } from "../../../game_frontend/src_game/src/main.ts";

import aiImg from "../images/ai_mode.png?inline";
import loclalImg from "../images/local_mode.png?inline";
import remoteImg from "../images/remote.png?inline"

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
    spyUi();
    return;
  }

  // 👇 PONG GAME
  if (type === "pong") {
    main.innerHTML = `
      <div id="pong-root" class="relative w-full h-full flex flex-col items-center justify-center gap-8">
        
        <!-- Selection Menu -->
        <div id="game-lobby" class="w-full flex flex-col items-center justify-center gap-8">
          <h2 class="text-4xl font-bold text-center text-white transform hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-4">
            <span class="material-symbols-outlined text-[80px] text-yellow-400">sports_esports</span>
            Choose Your Match
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
            <!-- Local Friend-->
            <button id="btn-friend" class="group relative overflow-hidden p-8 rounded-3xl border border-white/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
              <img src="${loclalImg}" alt="Versus Friend" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500">
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div class="p-4 rounded-full transition-colors duration-500">
                    <span class="material-symbols-outlined text-5xl text-white transition-colors">groups</span>
                </div>
                <div class="text-center">
                    <span class="block text-xl font-bold text-white mb-2 tracking-wide">Versus Friend</span>
                    <p class="text-sm text-white/60 font-medium">Local Multiplayer</p>
                </div>
              </div>
            </button>
             
            <!-- Local AI -->
            <button id="btn-ai" class="group relative overflow-hidden p-8 rounded-3xl border border-white/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
              <img src="${aiImg}" alt="Versus AI" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500">
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div class="p-4 rounded-full transition-colors duration-500">
                    <span class="material-symbols-outlined text-5xl text-white transition-colors">smart_toy</span>
                </div>
                <div class="text-center">
                    <span class="block text-xl font-bold text-white mb-2 tracking-wide">Versus AI</span>
                    <p class="text-sm text-white/60 font-medium">Single Player</p>
                </div>
              </div>
            </button>

            <!-- Remote -->
            <button id="btn-remote" class="group relative overflow-hidden p-8 rounded-3xl border border-white/10 transition-all duration-500 hover:scale-105 backdrop-blur-sm">
              <img src="${remoteImg}" alt="Online Match" class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500">
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div class="p-4 rounded-full transition-colors duration-500">
                    <span class="material-symbols-outlined text-5xl text-white transition-colors">public</span>
                </div>
                <div class="text-center">
                    <span class="block text-xl font-bold text-white mb-2 tracking-wide">Online Match</span>
                    <p class="text-sm text-white/60 font-medium">Global Multiplayer</p>
                </div>
              </div>
            </button>
          </div>

          <div class="flex justify-center flex-col items-center gap-4 w-full max-w-md">
            <div id="join-section" class="hidden w-full animate-slide-up">
               <div class="flex gap-2">
                 <input type="text" id="join-id" placeholder="Enter Match ID..." class="flex-grow px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-cyan-500 outline-none transition-all placeholder:text-white/20 font-mono text-lg backdrop-blur-sm">
                 <button id="btn-join" class="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-2xl font-bold text-white hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/25 tracking-wider uppercase text-sm">Join</button>
               </div>
            </div>
            <button id="toggle-join" class="px-6 py-2 rounded-full text-sm text-white/40 hover:text-cyan-400 hover:bg-white/5 transition-all border border-transparent hover:border-white/10 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">login</span>
                Join existing match via ID
            </button>
          </div>
        </div>

        <!-- Game View -->
        <div id="game-container" class="hidden w-full h-full flex flex-col items-center justify-center">
        
            <div class="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
                 <div id="game-info" class="text-white font-mono bg-black/70 backdrop-blur-xl rounded-3xl px-10 py-5 border border-white/10 shadow-2xl transition-all duration-500 flex flex-col items-center justify-center text-center gap-2 pointer-events-auto hidden"></div>
            </div>
          <div class="canvas-container w-full h-full flex items-center justify-center p-8"></div>
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
