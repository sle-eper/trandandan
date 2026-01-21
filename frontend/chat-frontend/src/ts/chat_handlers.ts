// import { currentUserId } from "../../../auth_frontend/src_auth/login/login";
import { friendDisconnectHandler } from "../../../profile_frontend/src/components/FriendRequest";
import { getSocketInstance } from "../../../socket_manager/socket";
import { lastMsg, receivedMsg,inputMsg, sendMsg } from "../components/content";
import { moveUp,setupPopupEvents,addMenuNotification } from "./chat_ui_tools";
import { getImInRoom } from "./global_var";
import { getCurrentUserId } from "./global_var";
import { navigate } from "../../../auth_frontend/src_auth/login/router";

export const liveHandler = (id:string, roomName:string, msg:string, timeOfMsg:string)=>{
    moveUp(id);
    // console.log("id", id);
    const timeOfMsgSpan: HTMLSpanElement = document.getElementById(
      `time-of-msg-${id}`
    ) as HTMLSpanElement;
    if (roomName !== getImInRoom()) {
      const counterElement: HTMLDivElement = document.getElementById(
        `counter-of-${id}`
      ) as HTMLDivElement;
      if(!counterElement) return;
      if (counterElement?.classList.contains("hidden"))
        counterElement?.classList.remove("hidden");

    let counterElementValue: number = Number(counterElement.textContent);
    ++counterElementValue;
    if (counterElementValue <= 9)
      counterElement.innerText =
        String(counterElementValue);
    else if (counterElementValue > 9) counterElement.innerText = "+9";
    const containerMsg = document.getElementById(`container-of-last-msg-of-${id}`);
    if (containerMsg) containerMsg.innerHTML = lastMsg("recv", msg, id);
    if (timeOfMsgSpan) timeOfMsgSpan.innerText = timeOfMsg;
  }
}
export const receiveMessageHandler = (msg:string, msgId:string, friendId:string, timeOfMsg:string, friendImg:string)=>{
    const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
    chatZone?.insertAdjacentHTML("beforeend",receivedMsg(msg, timeOfMsg, friendImg));
    getSocketInstance()?.emit("ack_message", msgId);
    const containerMsg = document.getElementById(`container-of-last-msg-of-${friendId}`);
    if (containerMsg) containerMsg.innerHTML = lastMsg("seen", msg, friendId);
}

export const allowMsgHandler = (allow: boolean, status: string) => {
  const msg = document.getElementById("x");
  if (msg && allow) msg.innerHTML = inputMsg("accepted", status);
  else if (msg && !allow) msg.innerHTML = inputMsg("blocked", status);
  setupPopupEvents();
}

export const blockOrAcceptedHandler = (roomName: string, statusGlobal: string, status: string) => {
  const dm = document.getElementById("DM");
  if (dm && dm.dataset.roomName == roomName) {
    const msg = document.getElementById("x");
    if (msg) msg.innerHTML = inputMsg(statusGlobal, status);
    setupPopupEvents();
  }
}

export const messages_batchHandler = (messages: any[], friendImg: string) => {
  const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
  if (!chatZone) return;
  for (const msg of messages) {
    if (msg.send == getCurrentUserId())
      chatZone?.insertAdjacentHTML(
        "beforeend",
        sendMsg(msg.msg, msg.time)
      );
    else
      chatZone?.insertAdjacentHTML(
        "beforeend",
        receivedMsg(msg.msg, msg.time, friendImg)
      );
  }
  requestAnimationFrame(() => {
    chatZone.scrollTop = chatZone.scrollHeight;
  });
}

export const messages_old_batchHandler = (messages: any[], friendImg: string) => {
  const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
  for (const msg of messages) {
    if (msg.send == getCurrentUserId())
      chatZone.insertAdjacentHTML(
        "afterbegin",
        sendMsg(msg.msg, msg.time)
      );
    else
      chatZone.insertAdjacentHTML(
        "afterbegin",
        receivedMsg(msg.msg, msg.time, friendImg)
      );
  }
}

export const chatErrorHandler = (errorMsg:string) => {
  const container = document.getElementById("chat-alert-root");
    if (!container) return;
  container.classList.remove("hidden");
  container.innerHTML = "";

  const alertDiv:HTMLDivElement = document.createElement("div") as HTMLDivElement;
  alertDiv.className = `text-[#E63946]`;
  alertDiv.innerHTML = `
    <span class="text-sm">
      ${errorMsg}
    </span>
  `;
  container.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
    container.classList.add("hidden");
  }, 5000); 
}

export const request_to_playHandler = (from:string,friendId:string,notifId:string) => {
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
          🎮 <strong>${from}</strong> wants to play
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

      notif.querySelector(".accept")?.addEventListener("click", () => {
        getSocketInstance()?.emit("accept_play", getCurrentUserId(),friendId );
        notif.remove();
      });

      notif.querySelector(".reject")?.addEventListener("click", () => {
        // console.log("reject clicked", friendId);
        getSocketInstance()?.emit("reject_play", getCurrentUserId(),friendId);
        notif.remove();
      });
      addMenuNotification("🎮 ",`<strong>${from}</strong> wants to play`,notifId);


  setTimeout(() => {
    notif.remove();
  }, 10000);
}

export const not_agreeHandler = (from:string ,notifId:string) => {
    console.log("not_agreeHandler called from:", from);
    const container = document.getElementById("play-notification-container");

  if (!container) return;

  container.innerHTML = "";

  const notif = document.createElement("div");
  notif.className = `
      flex items-center justify-between
      w-full px-4 py-2 rounded-2xl
      bg-[#1a1a1a]/90 border border-red-500/40
      text-red-400
      shadow-lg backdrop-blur-lg
      animate-slide-in
    `;

  notif.innerHTML = `
      <span class="text-sm truncate">
        ❌ <strong>${from}</strong> rejected your play request
      </span>
    `;

  container.appendChild(notif);
  const challenge = document.getElementById(
    "challenge-option"
  )
  const textEl: HTMLElement = challenge?.querySelector("p") as HTMLElement;
  const iconEl: HTMLElement = challenge?.querySelector("span") as HTMLElement;
  challenge?.classList.remove(
    "opacity-50",
    "cursor-not-allowed",
    "pointer-events-none"
  );


  clearInterval(Number(challenge?.dataset.intervalId));
  textEl.textContent = 'Challenge';
  iconEl?.classList.remove("opacity-0");

  addMenuNotification("❌", `<strong>${from}</strong> rejected your play request`, notifId)

  setTimeout(() => {
    notif.remove();
  }, 3000);
}

export const msg_notificationHandler = (from: string, msg: string, notifId: string) => {
  const container = document.getElementById("play-notification-container");
  if (!container) return;

  container.innerHTML = "";

  const notif = document.createElement("div");
  notif.className = `
      flex items-center justify-between gap-3
      w-full px-4 py-2 rounded-2xl
      bg-[#1a1a1a]/90 border border-[#FD1D1D]/40
      shadow-lg backdrop-blur-lg
      animate-slide-in
    `;


  notif.innerHTML = `
      <span class="text-sm truncate">
        💬 <strong>${from}</strong>: ${msg}
      </span>
    `;
  container.appendChild(notif);
  setTimeout(() => {
    notif.remove();
  }, 5000);
  addMenuNotification("💬", `<strong>${from}</strong>: ${msg}`, notifId);
}

export const user_onlineHandler = (userId: string) => {
  const elements = document.querySelectorAll(`.online-indicator-${userId}`)
  if (!elements)
    return;
  elements.forEach(el => {
    el.classList.remove("hidden");
  });
};

export const user_offlineHandler = (userId: string) => {
  const elements = document.querySelectorAll(`.online-indicator-${userId}`)
  if (!elements)
    return;
  elements.forEach(el => {
    if (!el.classList.contains("hidden"))
      el.classList.add("hidden");
  });
};
export const start_gameHandler = (data: { gameId: string, side: string }) => {
  console.log('Starting remote game from chat challenge:', data.gameId, 'as side:', data.side);
  // Redirect using the SPA router navigate function, passing both gameId and side
  navigate(`/game/pong?gameId=${data.gameId}&side=${data.side}`);
};
