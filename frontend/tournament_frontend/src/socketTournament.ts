import * as Socket from "../../socket_manager/socket";
import { navigate } from "../../auth_frontend/src_auth/app"
import { addMenuNotification } from "../../chat-frontend/src/ts/chat_ui_tools";
import { renderTournamentBracket, showToast } from "./create_tournament";

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
    if (responseData.message === "Tournament Full")
    {
      console.log("Response data::::::::::::::::::::::::::", responseData);
      socket.emit("tournament:start", { tournamentName: data.tournamentName, maxPlayers: 4 });
      showToast("Tournament is full. You have been added to the tournament!");
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



export function StartingTournament(data: any) {

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
          🎮 <strong>${data.tournamentName}</strong> is starting now! 
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
    renderTournamentBracket();
    navigate(`/tournament/bracket/${data.tournamentName}?maxPlayers=${data.maxPlayers}`);
    notif.remove();
  });

  notif.querySelector(".reject")?.addEventListener("click", () => {
    notif.remove();
  });
  addMenuNotification("🎮 ", `<strong>${data.tournamentName}</strong> wants to join`, "1");
  setTimeout(() => {
    notif.remove();
  }, 40000);
} ``