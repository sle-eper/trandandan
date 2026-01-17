import * as Socket from "../../socket_manager/socket";
import { navigate } from "../../auth_frontend/src_auth/app"
import { addMenuNotification } from "../../chat-frontend/src/ts/chat_ui_tools";
import { showToast } from "./create_tournament";

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
          🎮 <strong>${data.tournamentName}</strong> want to join 
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
      body: JSON.stringify({ tournamentName: data.tournamentName, userId: data.userId }),
    });
    console.log("User rejected the tournament invitation.", result);
    // getSocketInstance()?.emit("accept_play", getCurrentUserId(),friendId );
    if (!result.ok)
    {
      showToast(result.statusText || "Failed to join tournament.");
      notif.remove();
      return; 
    }
    showToast("Joined tournament successfully!");
    notif.remove();
  });

  notif.querySelector(".reject")?.addEventListener("click", () => {

    // save notif  
    // console.log("reject clicked", friendId);
    // getSocketInstance()?.emit("reject_play", getCurrentUserId(),friendId);
    notif.remove();
  });
  addMenuNotification("🎮 ", `<strong>${data.tournamentName}</strong> wants to join`, data.notfId);
  setTimeout(() => {
    notif.remove();
  }, 10000);


  // console.log("Tournament invitation received:", data.tournamentName);
  // console.log("User ID:", data.userId);
  // const accept = confirm(`You have been invited to join the tournament: ${data.tournamentName}. Do you want to join?`);
  // const socket = Socket.getSocketInstance();
  // if (accept) {
  //   // Logic to join the tournament
  //   console.log("User accepted the tournament invitation.");
  //   socket?.emit("tournament:join", { tournamentName: data.tournamentName });
  //   console.log("Emitted join event for tournament:::::::::::::::::::::",data.userId);
  //   const result = fetch("/tournament/participant/add", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ tournamentName: data.tournamentName , userId : data.userId}),
  //   });
  //   // navigate("/tournament/bracket");
  // } else {
  //   console.log("User declined the tournament invitation.");
  // }
} 