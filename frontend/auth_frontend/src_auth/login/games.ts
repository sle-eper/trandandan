import { gamesTemplate } from "./templates.ts";
import { spyUi } from "../../../spy_frontend/src_spy/app.ts"
import { updateContent } from "./routing.ts";
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
      <div id="pong-root" class="w-full h-full">
        <div class="flex flex-col items-center justify-center h-full">
          <div class="mb-4 flex flex-wrap justify-center gap-2">
            <button id="btn-friend" class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition">Local vs Friend</button>
            <button id="btn-ai" class="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition">Local vs AI</button>
            <button id="btn-remote" class="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition">Create Remote Match</button>
          </div>
          
          <div class="mb-6 flex justify-center gap-2 items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
            <input type="text" id="join-id" placeholder="Enter Match ID..." class="px-3 py-2 bg-black border border-gray-600 rounded text-white focus:border-blue-500 outline-none w-48">
            <button id="btn-join" class="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition">Join Match</button>
          </div>

          <div id="game-info" class="text-white mb-4 text-center font-mono bg-gray-800 rounded px-4 py-2 hidden"></div>
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
