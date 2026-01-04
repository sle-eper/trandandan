import { socket } from "../../../auth_frontend/src_auth/login/login";
import { PlayerProfileManager } from "../../../profile_frontend/src/components/FriendRequest";

import {
  lastMsg,
  chatZones,
  listOfMsg,
  DM,
  sendMsg,
  receivedMsg,
  profileNav,
  inputMsg,
  choseFriend,
  generateBlockButton,
} from "../components/content";

let myImg: string = "";
let imInRoom: string = "";
let friendId: string = "";
let userID: string = "";

function moveUp(id: string) {
  const container = document.getElementById("list-of-msg");
  if(!container)
    return;
  const target = Array.from(container.children).find(
    (el) => el.dataset.id == id
  );
  if (target) container?.prepend(target);
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    imInRoom = "";
    friendId = "";
    const dmZone = document.getElementById("DM");
    if (dmZone) dmZone.innerHTML = choseFriend();
  }
});

function setupPopupEvents() {
  //Ai
  const blockButton = document.getElementById("block-button");
  const unblockButton = document.getElementById("unblock-button");
  const blockOption = document.getElementById("block-option");
  const unblockOption = document.getElementById("unblock-option");
  const sendButton = document.getElementById(
    "send-button"
  ) as HTMLButtonElement;

  if (blockButton && blockOption) {
    blockButton.addEventListener("click", () =>
      blockOption.classList.remove("hidden")
    );
  }

  if (unblockButton && unblockOption) {
    unblockButton.addEventListener("click", () =>
      unblockOption.classList.remove("hidden")
    );
  }
  function getTime(): string {
    const date = new Date();
    const h: string = date.getHours().toString().padStart(2, "0");
    const m: string = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  }
  const textarea = document.getElementById(
    "input-msg-zone"
  ) as HTMLTextAreaElement;

  textarea?.addEventListener("input", () => {
    if (textarea.value.trim() === "") {
      textarea.style.overflow = "hidden";
    } else {
      // textarea.style.padding = "10px"
      textarea.style.overflow = "auto";
    }
  });

  if (sendButton) {
    function showToast(message: string, duration = 3000) {//TODO hadi khasha twli pro chewiya
      const container = document.getElementById("err-display");
      if(!container)return;
      container.innerHTML = "";
      const notif = document.createElement("div");
      notif.id = "error-notification";
      notif.className = `
        gap-3
        px-4 py-2 rounded-2xl text-center
        bg-[#1a1a1a]/90 border border-[#FD1D1D]/40
        shadow-lg backdrop-blur-lg
        animate-slide-in
      `;

      notif.innerText = `${message}`;

      container.appendChild(notif);
      setTimeout(()=>{
        notif.remove()
      },duration);
    }

    function send_message() {
      const value: string = textarea.value;
      if (value.trim()) {
        if(value.length > 2000)
        {
          showToast("You cannot send more than 2000 characters");
          return
        }

        const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
        const msgTime = document.getElementById(`time-of-msg-${friendId}`);
        const time = getTime();
        chatZone.innerHTML += sendMsg(value, time);
        console.log("user",userID,"friend",friendId);
        socket.emit("send_message", { value, userID, friendId });
        moveUp(friendId);
        const container = document.getElementById(
          `container-of-last-msg-of-${friendId}`
        );
        chatZone.scrollTop = chatZone.scrollHeight;
        if (container) container.innerHTML = lastMsg("send", value, friendId);
        if (msgTime) msgTime.innerHTML = time;
      }
      textarea.value = "";
      textarea.style.overflow = "hidden";
      textarea.focus();
    }
    sendButton.addEventListener("click", () => {
      send_message();
    });
    textarea.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        send_message();
      }
    });
  }
}

function socketListener() {
  socket.on("live", (id, roomName, msg, timeOfMsg) => {
    moveUp(id);
    // console.log("id", id);
    const timeOfMsgSpan: HTMLSpanElement = document.getElementById(
      `time-of-msg-${id}`
    ) as HTMLSpanElement;
    if (roomName !== imInRoom) {
      const counterElement: HTMLDivElement = document.getElementById(
        `counter-of-${id}`
      ) as HTMLDivElement;
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
  });
  socket.on("receive_message", (msg, msgId, friendId, timeOfMsg, friendImg) => {
    console.log('image received in chat script:', friendImg);
    const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
    // console.log("recvMsg",chatZone)
    chatZone?.insertAdjacentHTML("beforeend",receivedMsg(msg, timeOfMsg, friendImg));
    socket.emit("ack_message", msgId);
    const containerMsg = document.getElementById(`container-of-last-msg-of-${friendId}`);
if (containerMsg) containerMsg.innerHTML = lastMsg("seen", msg, friendId);
    // const container = document.getElementById(`container-of-last-msg-of-${friendId}`);
  });
  socket.on("allowMsg", (allow: boolean,status:string) => {
    const msg = document.getElementById("x");
    if (msg && allow) msg.innerHTML = inputMsg("accepted",status);
    else if (msg && !allow) msg.innerHTML = inputMsg("blocked",status);
    setupPopupEvents();
  });
  socket.on("blockOrAccepted", (roomName, statusGlobal,status) => {
    const dm = document.getElementById("DM");
    if (dm && dm.dataset.roomName == roomName) {
      const msg = document.getElementById("x");
      if (msg) msg.innerHTML = inputMsg(statusGlobal,status);
      setupPopupEvents();
    }
  });
  socket.on("messages_batch", (messages, friendImg) => {
    const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
    if(!chatZone) return;
    for (const msg of messages) {
      if (msg.send == userID)
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
  });
  socket.on("messages_old_batch", (messages, friendImg) => {
    const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
    for (const msg of messages) {
      if (msg.send == userID)
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
  });
  socket.on("setIMg", (img) => {
    myImg = img;
  });
  socket.on("request_to_play", (from,friendId,notifId) => {
      const notification = document.getElementById("notification-menu");
      const container = document.getElementById("play-notification-container");
      if (!container) return;

      if (document.getElementById("play-notification")) return;
      container.innerHTML = "";

      const notif = document.createElement("div");
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

      notif.querySelector(".accept").onclick = () => {
        socket.emit("accept_play", userID,friendId );
        notif.remove();
      };

      notif.querySelector(".reject").onclick = () => {
        socket.emit("reject_play", userID,friendId);
        notif.remove();
      };
    const msgNotif = document.createElement("div");
    msgNotif.className = `w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                  transition rounded-lg`
    msgNotif.innerHTML = `
        <div class = "flex justify-between">
        <span class="block max-w-70 truncate">
          🎮 <strong>${from}</strong> wants to play
        </span>
        <span class="hover:cursor-pointer close-btn">x</span>
      </div>
    `;
    notification?.prepend(msgNotif);
    msgNotif.querySelector(".close-btn")?.addEventListener("click", () => {
    socket.emit("removeNotif", notifId);
    msgNotif.remove();
    const notifmenu = document.getElementById("notification-menu");
    if(notifmenu?.children.length === 0)
      notifmenu.classList.add("hidden")
  });


      setTimeout(() => {
        notif.remove();
      }, 10000);
  });
  socket.on("not_agree", (from ,notifId) => {
    const container = document.getElementById("play-notification-container");
    const notification = document.getElementById("notification-menu");

    
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
    const challenge  = document.getElementById(
      "challenge-option"
    )
    const textEl = challenge?.querySelector("p");
    const iconEl = challenge?.querySelector("span");
    // const originalText = textEl?.textContent;
    challenge?.classList.remove(
      "opacity-50",
      "cursor-not-allowed",
      "pointer-events-none"
    );


    clearInterval(challenge.dataset.intervalId);
    textEl.textContent = 'Challenge';
    iconEl?.classList.remove("opacity-0");

    const msgNotif = document.createElement("div");
    msgNotif.className = `w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                  transition rounded-lg`
    msgNotif.innerHTML = `
    <div class = "flex justify-between">
      <span class="block max-w-70 truncate">
        ❌ <strong>${from}</strong> rejected your play request
      </span>
      <span class="hover:cursor-pointer close-btn">x</span>
    </div>
    `;
    notification?.prepend(msgNotif);
    msgNotif.querySelector(".close-btn")?.addEventListener("click", () => {
    socket.emit("removeNotif", notifId);
    msgNotif.remove();
    const notifmenu = document.getElementById("notification-menu");
    if(notifmenu?.children.length === 0)
      notifmenu.classList.add("hidden")
    });

    setTimeout(() => {
      notif.remove();
    }, 3000);
  });
  socket.on('msg_notification',(from , msg,notifId)=>{
    const container = document.getElementById("play-notification-container");
    const notification = document.getElementById("notification-menu");
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
    const msgNotif = document.createElement("div");
    msgNotif.className = `w-full text-left px-4 py-2 text-white/90 hover:bg-[#E63946]/20
                  transition rounded-lg`
    msgNotif.innerHTML = `
      <div class="flex justify-between">
        <span class="block max-w-70 truncate">
          💬 <strong>${from}</strong>: ${msg}
        </span>
        <span class="hover:cursor-pointer close-btn">x</span>
      </div>
    `;
    msgNotif.querySelector(".close-btn")?.addEventListener("click", () => {
    socket.emit("removeNotif", notifId);
    msgNotif.remove();
    const notifmenu = document.getElementById("notification-menu");
    if(notifmenu?.children.length === 0)
      notifmenu.classList.add("hidden")
    });
    notification?.prepend(msgNotif);
    


    // console.log(from,msg);

  })
  socket.on("user_online", (userId: string) => {
    const elements = document.querySelectorAll(`.online-indicator-${userId}`)
    if(!elements)
      return;
    elements.forEach(el => {
      el.classList.remove("hidden");
    });
  });
  socket.on("user_offline", (userId: string) => {
    const elements = document.querySelectorAll(`.online-indicator-${userId}`)
    if(!elements)
      return;
    elements.forEach(el => {
      if(!el.classList.contains("hidden"))
          el.classList.add("hidden");
    });
  });

}

export async function showMainUI() {
  const response = await fetch("/auth/verify", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // VERY IMPORTANT FOR Cookies
  });
  // console.log("response status:", response.status);
  let myId: string;
  const responseJson = await response.json()
  myId =  responseJson.id
  socket.emit("con", myId);
  userID = myId;
  // console.log(userID);
  const chatContent = document.getElementById("dashboard-content");

  let sendButton: HTMLButtonElement;
  let chatZone: HTMLDivElement;
  let inputMsgZone: HTMLInputElement;
  let dmZone: HTMLElement | null;

  function fetchListOfFriends(): Promise<any> {
    return new Promise((resolve) => {
      socket.once("friends_list", (friends) => {
        resolve(friends);
      });
      socket.emit("get_friends");
    });
  }

  if (chatContent) {
    chatContent.classList.add("gap-6", "gap-y-3");
    // chatContent.classList.remove("flex-grow");
    const friends = await fetchListOfFriends();
    // console.table(friends.friends);
    chatContent.innerHTML = listOfMsg(friends.friends,friends.waitingMsg,myId);
    if(friends && friends.friends.length > 0)
      chatContent.innerHTML += DM();
    //     //get all of list friends
    const friendsEvent = document.querySelectorAll(".friend-msg-zone");
    friendsEvent.forEach((friend) => {
      friend.addEventListener("click", () => {
        //         /******************************************get msg on scroll*******************************/

        let firestOne: boolean = false;
        let isFetching = false;
        function onScroll() {
          let offset: number = 0;
          if (!firestOne) {
            socket.emit("get_messages", { myId, friendId, limit: 20, offset });
            firestOne = true;
          }
          const chatZone = document.getElementById("chat-zone");
          if (chatZone) {
            chatZone.addEventListener("scroll", async () => {
              if (chatZone.scrollTop < 190 && !isFetching) {
                isFetching = true;
                offset += 20;
                await socket.emit("get_old_messages", {
                  myId,
                  friendId,
                  limit: 20,
                  offset,
                });
                isFetching = false;
              }
            });
          }
        }

        //             /**********************************************************************************************/

        imInRoom = friend.dataset.roomname;
        friendId = friend.dataset.id;

        const friendFind = friends.friends.find((f) => f.id == friendId);
        if (friendFind) {
          const roomName: string = [myId, friendFind.id].sort().join("_");
          const dm = document.getElementById("DM");
          const listContainer = document.getElementById("list-of-msg-container");
          if (dm){
              dm.dataset.roomName = roomName;
              dm.classList.remove("hidden")
              listContainer?.classList.add("hidden")
            }
          requestAnimationFrame(()=>{
            document.getElementById("back-btn")?.addEventListener("click", () => {
                dm?.classList.add("hidden");
                listContainer?.classList.remove("hidden");
                imInRoom = "";
                friendId = "";
            });
          })
          socket.emit("joinToRoom", roomName);

          const counterElement: HTMLDivElement = document.getElementById(
            `counter-of-${friendId}`
          ) as HTMLDivElement;
          const lastMsgVar: HTMLSpanElement = document.getElementById(
            `last-msg-${friendId}`
          ) as HTMLSpanElement;
          if (!counterElement.classList.contains("hidden")) {
            counterElement.textContent = "0";
            counterElement.classList.add("hidden");
          }
          if (lastMsgVar.classList.contains("font-semibold")) {
            lastMsgVar.classList.remove("font-semibold");
            lastMsgVar.classList.remove("text-[#F5F5F5]");
            lastMsgVar.classList.add("font-thin");
            lastMsgVar.classList.add("text-[#888]");
          }
          //*********************************************************************** */
          dmZone = document.getElementById("DM");
          let contentChat = profileNav(friendFind.avatar_url,friendFind.username,friendId);
          // const userAccount = document.getElementById('user-account');
          // console.log("userAccount", userAccount);
          // userAccount?.addEventListener('click',()=>{
          //     const profileManager: any = new PlayerProfileManager();
          //     profileManager.showProfile(friendFind.id);
          // });
          contentChat += chatZones();
          if (dmZone) dmZone.innerHTML = contentChat;
          socket.emit("get_status", friendId);
            const userAccount = document.querySelectorAll('.user-account');
            userAccount.forEach(element => {
              element.addEventListener('click',()=>{
                const profileManager: any = new PlayerProfileManager();
                profileManager.showPlayerProfile(friendId);
              });
            });
          ////////////////////////////////////////////////////////////////////////////////
          sendButton = document.getElementById(
            "send-button"
          ) as HTMLButtonElement;
          chatZone = document.getElementById("chat-zone") as HTMLDivElement;
          inputMsgZone = document.getElementById(
            "input-msg-zone"
          ) as HTMLInputElement;
          onScroll();

          //****************************** start popup part *************************************//
          {
            const option = document.getElementById(
              "more_vert"
            ) as HTMLSpanElement;
            const popupOption = document.getElementById(
              "popup-option"
            ) as HTMLDivElement;
            //When pressed 3 point
            option?.addEventListener("click", async () => {
              socket.emit("get_status",friendId)
              const btn1 = await new Promise<string>((resolve) => {
                  socket.once("blockBtn", (btn) => {
                      resolve(btn);
                  });
              });
              if(!document.getElementById("block-button") && !document.getElementById("unblock-button"))
                  document.getElementById("popup-option")!.innerHTML += generateBlockButton(btn1)
              if (popupOption.classList.contains("hidden"))
                popupOption.classList.remove("hidden");
              else 
                popupOption.classList.add("hidden");

            const blockButton = document.getElementById(
              "block-button"
            ) as HTMLDivElement;
            const blockOption = document.getElementById(
              "block-option"
            ) as HTMLButtonElement;
            const blockValid = document.getElementById(
              "blocked-valid"
            ) as HTMLButtonElement;
            const blockUnvalid = document.getElementById(
              "blocked-unvalid"
            ) as HTMLButtonElement;
            const unblockButton = document.getElementById(
              "unblock-button"
            ) as HTMLButtonElement;
            const unblockValid = document.getElementById(
              "unblocked-valid"
            ) as HTMLButtonElement;
            const unblockUnvalid = document.getElementById(
              "unblocked-unvalid"
            ) as HTMLButtonElement;
            const unblockOption = document.getElementById(
              "unblock-option"
            ) as HTMLDivElement;
            const challenge  = document.getElementById(
              "challenge-option"
            )

            // to close popup if click out of popup
            window.addEventListener("click", (event) => {
              const target = event.target as HTMLElement;
              if (
                !popupOption.contains(target) &&
                !popupOption.classList.contains("hidden") &&
                target.id !== "more_vert" &&
                target.id !== "blocked-unvalid" &&
                target.id !== "unblocked-unvalid"
              )
                popupOption.classList.add("hidden");
              if (
                !blockOption.contains(target) &&
                !blockOption.classList.contains("hidden") &&
                !target.classList.contains("block-button-class")
              )
                blockOption.classList.add("hidden");
              if (
                !unblockOption.contains(target) &&
                !unblockOption.classList.contains("hidden") &&
                !target.classList.contains("unblock-button-class")
              )
                unblockOption.classList.add("hidden");
            });

            
          if (challenge) {
            const textEl = challenge.querySelector("p");
            const iconEl = challenge.querySelector("span");
            if(!challenge.dataset.click)
            {
              challenge.addEventListener("click", () => {
                challenge.classList.add(
                  "opacity-50",
                  "cursor-not-allowed",
                  "pointer-events-none"
                );
  
                let remaining = 10;
                const originalText = textEl?.textContent;
  
                textEl.textContent = `Waiting ${remaining}s`;
                iconEl.classList.add("opacity-0");
  
                socket.emit("challenge", friendId);
  
                challenge.dataset.intervalId = setInterval(() => {
                  remaining--;
                  textEl.textContent = `Waiting ${remaining}s`;
  
                  if (remaining <= 0) {
                    clearInterval(challenge.dataset.intervalId);
  
                    challenge.classList.remove(
                      "opacity-50",
                      "cursor-not-allowed",
                      "pointer-events-none"
                    );
  
                    textEl.textContent = originalText;
                    iconEl.classList.remove("opacity-0");
                  }
                }, 1000);
              });
              challenge.dataset.click = 'yes';
            }
          }

            // if chose block button show popup of block option
            if (blockButton) {
              blockButton.addEventListener("click", () => {
                popupOption.classList.remove("hidden");
                blockOption.classList.remove("hidden");
              });
            }

            if (unblockButton) {
              unblockButton.addEventListener("click", () => {
                popupOption.classList.remove("hidden");
                unblockOption.classList.remove("hidden");
              });
            }

            //block behaver
            blockValid.addEventListener("click", () => {
              socket.emit("status", { status: "blocked", friendId });
              blockOption.classList.add("hidden");
              const popupOption = document.getElementById("popup-option");
              if (popupOption) {
                popupOption.innerHTML = `
                                    <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                                        <p>Challenge</p>
                                        <span class="material-symbols-outlined">swords</span>
                                    </div>
                                    ${generateBlockButton("blocked")}
                                `;
              }
              setupPopupEvents();
            });
            blockUnvalid.addEventListener("click", () => {
              blockOption.classList.add("hidden");
              popupOption.classList.remove("hidden");
            });
            //unblock behaver
            unblockValid.addEventListener("click", () => {
              socket.emit("status", { status: "accepted", friendId });
              unblockOption.classList.add("hidden");
              const popupOption = document.getElementById("popup-option");
              if (popupOption) {
                popupOption.innerHTML = `
                                    <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                                        <p>Challenge</p>
                                        <span class="material-symbols-outlined">swords</span>
                                    </div>
                                    ${generateBlockButton("accepted")}
                                `;
              }
              setupPopupEvents();
            });
            unblockUnvalid.addEventListener("click", () => {
              unblockOption.classList.add("hidden");
              popupOption.classList.remove("hidden");
            });
            });
          }
          //
          //****************************** end popup part *************************************//
        }
      });
    });
  }
}
socketListener();
