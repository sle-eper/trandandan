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
          <div class="mb-4">
            <button id="btn-friend" class="btn mr-2">Play vs Friend</button>
            <button id="btn-ai" class="btn">Play vs AI</button>
          </div>
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
