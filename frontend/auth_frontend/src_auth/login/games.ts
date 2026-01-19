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
            <!-- Local Friend -->
            <button id="btn-friend" class="group relative overflow-hidden p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(34,211,238,0.3)] backdrop-blur-sm">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div class="p-4 rounded-full bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors duration-500 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
                    <span class="material-symbols-outlined text-5xl text-cyan-400 group-hover:text-cyan-300 transition-colors">groups</span>
                </div>
                <div class="text-center">
                    <span class="block text-xl font-bold text-white mb-2 tracking-wide">Versus Friend</span>
                    <p class="text-sm text-cyan-100/60 font-medium">Local Multiplayer</p>
                </div>
              </div>
            </button>

            <!-- Local AI -->
            <button id="btn-ai" class="group relative overflow-hidden p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] backdrop-blur-sm">
              <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div class="p-4 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors duration-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                    <span class="material-symbols-outlined text-5xl text-purple-400 group-hover:text-purple-300 transition-colors">smart_toy</span>
                </div>
                <div class="text-center">
                    <span class="block text-xl font-bold text-white mb-2 tracking-wide">Versus AI</span>
                    <p class="text-sm text-purple-100/60 font-medium">Single Player</p>
                </div>
              </div>
            </button>

            <!-- Remote -->
            <button id="btn-remote" class="group relative overflow-hidden p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(34,197,94,0.3)] backdrop-blur-sm">
              <div class="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div class="relative z-10 flex flex-col items-center gap-6">
                <div class="p-4 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <span class="material-symbols-outlined text-5xl text-green-400 group-hover:text-green-300 transition-colors">public</span>
                </div>
                <div class="text-center">
                    <span class="block text-xl font-bold text-white mb-2 tracking-wide">Online Match</span>
                    <p class="text-sm text-green-100/60 font-medium">Global Multiplayer</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Customization Section -->
          <div class="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
             ${(() => {
        const createColorCarousel = (idPrefix: string, defaultHex: string, label: string) => `
                        <div class="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group flex flex-col items-center gap-3 backdrop-blur-sm">
                            <span class="text-xs font-bold text-white/70 uppercase tracking-widest group-hover:text-white transition-colors">${label}</span>
                            <div class="flex items-center gap-4">
                                <button class="color-arrow p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-cyan-400 transition-all active:scale-95" data-target="${idPrefix}" data-dir="prev">
                                    <span class="material-symbols-outlined text-xl">chevron_left</span>
                                </button>
                                
                                <div class="color-preview w-10 h-10 rounded-full ring-2 ring-white/10 shadow-lg transition-all scale-100 hover:scale-110"
                                     id="preview-${idPrefix}"
                                     data-color="${defaultHex}"
                                     style="background-color: ${defaultHex}; box-shadow: 0 0 15px ${defaultHex}40;">
                                </div>

                                <button class="color-arrow p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-cyan-400 transition-all active:scale-95" data-target="${idPrefix}" data-dir="next">
                                    <span class="material-symbols-outlined text-xl">chevron_right</span>
                                </button>
                            </div>
                            <input type="hidden" id="${idPrefix}" value="${defaultHex}">
                        </div>
                    `;

        return `
                        ${createColorCarousel('lobby-color-left', '#FF0000', 'Left Paddle')}
                        ${createColorCarousel('lobby-color-right', '#FFD700', 'Right Paddle')}
                        ${createColorCarousel('lobby-color-ball', '#FF0000', 'Ball Color')}
                        ${createColorCarousel('lobby-color-arena', '#100505', 'Arena Theme')}
                    `;
      })()}
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
