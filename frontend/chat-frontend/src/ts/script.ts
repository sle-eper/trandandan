import { io } from "socket.io-client";
const socket = io("http://localhost:3000"); //TODO hadi ra hebla o khedama
// const socket = io("http://localhost:8080/api/chat", {
//     path: "/socket.io",
//     withCredentials: true, // Send cookies for auth
//     transports: ['websocket', 'polling']
// });

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
  const target = Array.from(container!.children).find(
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
  // const inputMsgZone = document.getElementById("input-msg-zone") as HTMLInputElement;

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
    // function send_message() {
    // const value = inputMsgZone.value;
    // if (!value.trim()) return;
    //
    // const chatZone = document.getElementById("chat-zone")!;
    // const time = getTime();
    // const html = sendMsg(value, time, myImg, true);
    // chatZone.insertAdjacentHTML('beforeend', html);
    //
    //
    // const msgs = Array.from(chatZone.querySelectorAll(`.message-block[data-time="${time}"]`));
    // msgs.forEach((msgEl, idx) => {
    // const isLast = idx === msgs.length - 1;
    // const img = msgEl.querySelector('.msg-img') as HTMLElement;
    // const timeLabel = msgEl.querySelector('.msg-time');
    //
    // if (!isLast) {
    // if (img) img.style.visibility = "hidden";
    // if (timeLabel) timeLabel.remove();
    //
    // msgEl.classList.remove('mt-5');
    // msgEl.classList.add('mt-1');
    // } else {
    // msgEl.classList.remove('mt-1');
    // msgEl.classList.add('mt-5');
    // if (!timeLabel) {
    // const container = msgEl.querySelector('.max-w-[80%]') as HTMLElement;
    // if (container) container.insertAdjacentHTML('beforeend',
    // `<span class="msg-time text-xs text-[#888] mt-1 self-end">${time}</span>`
    // );
    // }
    // if (!img) {
    // msgEl.insertAdjacentHTML('beforeend',
    // `<img src="${myImg}" class="msg-img h-10 w-10 rounded-full mt-2 ml-2" alt="avatar">`
    // );
    // }
    // }
    // });
    //
    // socket.emit("send_message", { value, userID, friendId });
    // moveUp(friendId);
    // chatZone.scrollTop = chatZone.scrollHeight;
    // const container = document.getElementById(`container-of-last-msg-of-${friendId}`);
    // if (container) container.innerHTML = lastMsg('send', value, friendId);
    // inputMsgZone.value = '';
    // (inputMsgZone as HTMLTextAreaElement).style.height = 'auto';
    // }
    function send_message() {
      const value: string = textarea.value;
      if (value.trim()) {
        const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
        const msgTime = document.getElementById(`time-of-msg-${friendId}`);
        const time = getTime();
        chatZone.innerHTML += sendMsg(value, time, myImg);
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
    console.log("id", id);
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
          String(counterElementValue); //TODO handel 9+ msg
      else if (counterElementValue > 9) counterElement.innerText = "+9";
      const containerMsg = document.getElementById(`container-of-last-msg-of-${id}`);
      if (containerMsg) containerMsg.innerHTML = lastMsg("recv", msg, id);
      if (timeOfMsgSpan) timeOfMsgSpan.innerText = timeOfMsg;
    }
  });
  socket.on("receive_message", (msg, msgId, friendId, timeOfMsg, friendImg) => {
    const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
    console.log("recvMsg",chatZone)
    chatZone?.insertAdjacentHTML("beforeend",receivedMsg(msg, timeOfMsg, friendImg));
    socket.emit("ack_message", msgId);
    const containerMsg = document.getElementById(`container-of-last-msg-of-${friendId}`);
if (containerMsg) containerMsg.innerHTML = lastMsg("seen", msg, friendId);
    // const container = document.getElementById(`container-of-last-msg-of-${friendId}`);
  });
  socket.on("allowMsg", (allow: boolean) => {
    const msg = document.getElementById("x");
    if (msg && allow) msg.innerHTML = inputMsg("accepted");
    else if (msg && !allow) msg.innerHTML = inputMsg("blocked");
    setupPopupEvents();
  });
  socket.on("blockOrAccepted", (roomName, statusGlobal) => {
    const dm = document.getElementById("DM");
    if (dm && dm.dataset.roomName == roomName) {
      const msg = document.getElementById("x");
      if (msg) msg.innerHTML = inputMsg(statusGlobal);
      setupPopupEvents();
    }
  });
  socket.on("messages_batch", (messages, friendImg) => {
    const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
    for (const msg of messages) {
      if (msg.send == userID)
        chatZone.insertAdjacentHTML(
          "beforeend",
          sendMsg(msg.msg, msg.time, myImg)
        );
      else
        chatZone.insertAdjacentHTML(
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
          sendMsg(msg.msg, msg.time, myImg)
        );
      else
        chatZone.insertAdjacentHTML(
          "afterbegin",
          receivedMsg(msg.msg, msg.time, friendImg)
        );
    }
  });
  socket.on("setIMg", (img) => {
    // console.log("sasasasa",BACKEND_URL)
    myImg = img;
  });
}

export async function showMainUI() {
  const response = await fetch("http://localhost:8080/auth/verify", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // VERY IMPORTANT FOR Cookies
  });
  let myId: string;
  const responseJson = await response.json()
  myId =  responseJson.id
  socket.emit("con", myId);
  userID = myId;
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
    chatContent.innerHTML = listOfMsg(friends.friends,friends.waitingMsg,myId);
    if(friends.friends)
      chatContent.innerHTML += DM();
    //     //get all of list friends
    const friendsEvent = document.querySelectorAll(".friend-msg-zone");
    friendsEvent.forEach((friend) => {
      friend.addEventListener("click", (event) => {
        // document.getElementById("DM")
        // console.log("sdsadasd")
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
          console.log("friendFind:", friendFind.status);
          let contentChat = profileNav(friendFind.avatar_url,friendFind.username,friendFind.status);
          contentChat += chatZones();
          if (dmZone) dmZone.innerHTML = contentChat;
          socket.emit("get_status", friendId);
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
            option.addEventListener("click", async (event) => {
              socket.emit("get_status",friendId)
              const btn1 = await new Promise<string>((resolve) => {
                  socket.once("blockBtn", (btn) => {
                      console.log("btn", btn); 
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
