import * as Socket from "../../socket_manager/socket";
import { navigate } from "../../auth_frontend/src_auth/app"
import { addMenuNotification } from "../../chat-frontend/src/ts/chat_ui_tools";
import {  renderTournamentBracket , showToast } from "./create_tournament";

export function inviteHandlerReceived(data: any) {

  const container = document.getElementById("play-notification-container");
  if (!container) return;

  if (document.getElementById("play-notification")) return;
  container.innerHTML = "";

  const notif: HTMLDivElement = document.createElement("div") as HTMLDivElement;
  notif.id = "play-notification";
  notif.className = `
        flex items-center justify-between gap-3
        w-full px-4 py-2 rounded-2xl
        bg-[#1a1a1a]/90 border border-[#FD1D1D]/40
        shadow-lg backdrop-blur-lg
        animate-slide-in
      `;

  notif.innerHTML = `
        <span class="text-sm text-white truncate">
          Friend wants you  to join Tournament <strong>${data.tournamentName}</strong>
        </span>

        <div class="flex gap-2 shrink-0">
          <button class="accept px-3 py-1 text-xs font-bold rounded-lg
                        bg-green-500/80 hover:bg-green-500 transition">
            Accept
          </button>
          <button class="reject px-3 py-1 text-xs font-bold rounded-lg
                        bg-red-500/80 hover:bg-red-500 transition">
            Reject
          </button>
        </div>
      `;

  container.appendChild(notif);

  notif.querySelector(".accept")?.addEventListener("click", async () => {
    const result = await fetch("/tournament/participant/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tournamentName: data.tournamentName, userId: data.friendId }),
    });
    console.log("User rejected the tournament invitation.", result);
    if (!result.ok) {
      showToast(result.statusText || "Failed to join tournament.");
      notif.remove();
      return;
    }
    const responseData = await result.json();
    const socket = Socket.getSocketInstance();
    if (responseData.message === "Tournament Full") {
      socket.emit("matchmaking:start", { tournamentName: data.tournamentName, maxPlayers: 4 });
      showToast("Tournament is full.");
      notif.remove();
      return;
    }
    socket.emit("tournament:join", { tournamentName: data.tournamentName });
    showToast("Joined tournament successfully!");
    notif.remove();
  });

  notif.querySelector(".reject")?.addEventListener("click", () => {
    notif.remove();
  });
  addMenuNotification("🎮 ", `<strong>${data.tournamentName}</strong> wants to join`, data.notfId);
  setTimeout(() => {
    notif.remove();
  }, 10000);

}
export function start_gameHandlerTournament(data: any) {
console.log("------------------------------------", data);
  const container = document.getElementById("play-notification-container");
  if (!container) return;

  if (document.getElementById("play-notification")) return;
  container.innerHTML = "";

  const notif: HTMLDivElement = document.createElement("div") as HTMLDivElement;
  notif.id = "play-notification";
  notif.className = `
        flex items-center justify-between gap-3
        w-full px-4 py-2 rounded-2xl
        bg-[#1a1a1a]/90 border border-[#FD1D1D]/40
        shadow-lg backdrop-blur-lg
        animate-slide-in
      `;

  notif.innerHTML = `
        <span class="text-sm text-white truncate">
          Go To Game <strong>${data.gameId}</strong>
        </span>

        <div class="flex gap-2 shrink-0">
          <button class="accept px-3 py-1 text-xs font-bold rounded-lg
                        bg-green-500/80 hover:bg-green-500 transition">
            Accept
          </button>
          <button class="reject px-3 py-1 text-xs font-bold rounded-lg
                        bg-red-500/80 hover:bg-red-500 transition">
            Reject
          </button>
        </div>
      `;

  container.appendChild(notif);

  notif.querySelector(".accept")?.addEventListener("click", async () => {
    const socket = Socket.getSocketInstance();
    console.log("++++++++++++++++++++++++++++++++++++++++++", data);
    socket.emit("game:tournament:joined", data);
    renderTournamentBracket(data.tournamentName, data.maxPlayers, 1);
    navigate(`/tournament/bracket/${data.tournamentName}`);
    notif.remove();
  });

  notif.querySelector(".reject")?.addEventListener("click", () => {
    const socket = Socket.getSocketInstance();
    socket.emit("Tournament:leave", data);
    notif.remove();
  });
  addMenuNotification("🎮 ", `<strong>${data.tournamentName}</strong> Go to Game`, data.notfId);
  setTimeout(() => {
    const socket = Socket.getSocketInstance();
    socket.emit("Tournament:leave", data);
    notif.remove();
  }, 40000);

}

export function match_endedHandlerTournament(data: any) {
  if (data.result === 'won') {
  console.log("Tournament match ended handler called with data:", data);
  const message = data.message || "Your tournament match has ended.";
  showToast(message);
  }
  else if(data.result === 'lost') {
    console.log("Tournament match ended handler called with data:", data);
    const message = data.message || "Your tournament match has ended.";
    showToast(message);
  }
}