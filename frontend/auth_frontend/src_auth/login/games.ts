import { gamesTemplate } from "./templates.ts";
import { spyUi } from "../../../spy_frontend/src_spy/app.ts"
import { updateContent } from "./routing.ts";
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
    main.innerHTML = `<div id="pong-root" class="w-full h-full"></div>`;
    updateContent(main.innerHTML);
    return;
  }
}
