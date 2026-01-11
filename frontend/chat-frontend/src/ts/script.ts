// import { socket } from "../../../auth_frontend/src_auth/login/login";
import { socketInstance } from "../../../socket_manager/socket";
import { PlayerProfileManager } from "../../../profile_frontend/src/components/FriendRequest";
import { socketListener } from "./chat_socket";
import {setupPopupEvents ,onScroll,fetchListOfFriends,resetScrollState} from "./chat_ui_tools";
// import { currentUserId } from "../../../auth_frontend/src_auth/login/login";
import { setFriendId, setImInRoom , getFriendId, setCurrentUserId } from "./global_var";
// const socket = socketInstance;

import {
  chatZones,
  listOfMsg,
  DM,
  profileNav,
  choseFriend,
  generateBlockButton,
} from "../components/content";



window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    setImInRoom("");
    setFriendId("");
    const dmZone = document.getElementById("DM");
    if (dmZone) dmZone.innerHTML = choseFriend();
  }
});

export async function showMainUI() {
  socketListener();
  const response = await fetch("/auth/verify", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // VERY IMPORTANT FOR Cookies
  });
  const responseJson = await response.json()
  const userID = responseJson.id as string;
  setCurrentUserId(userID);
  if(!userID){
    console.error("User ID not found. Cannot show main UI.");
    return;
  }
  const chatContent = document.getElementById("dashboard-content");

  // let chatZone: HTMLDivElement;
  let dmZone: HTMLElement | null;
  
  if (chatContent) {
    chatContent.classList.add("gap-6", "gap-y-3");
    const friends = await fetchListOfFriends();
    console.table(friends.waitingMsg);
    chatContent.innerHTML = listOfMsg(friends.friends,friends.waitingMsg,userID);
    if(friends && friends.friends.length > 0)
      chatContent.innerHTML += DM();
    //     //get all of list friends
    const friendsEvent = document.querySelectorAll(".friend-msg-zone");
    friendsEvent.forEach((friend:any) => {
      friend.addEventListener("click", () => {
        setImInRoom(friend.dataset.roomname);
        setFriendId(friend.dataset.id);
        const friendId = getFriendId()
        const friendFind = friends.friends.find((f:any) => f.id == friendId);
        if (friendFind) {
          const roomName: string = [userID, friendFind.id].sort().join("_");
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
                setImInRoom("");
                setFriendId("");
            });
          })
          socketInstance()?.emit("joinToRoom", roomName);

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
          let contentChat = profileNav(friendFind.avatar_url,friendFind.username,friendId,friendFind.online_status);

          contentChat += chatZones();
          if (dmZone) dmZone.innerHTML = contentChat;
          socketInstance()?.emit("get_status", friendId);
            const userAccount = document.querySelectorAll('.user-account');
            userAccount.forEach(element => {
              element.addEventListener('click',()=>{
                const profileManager: any = new PlayerProfileManager();
                profileManager.showPlayerProfile(friendId);
              });
            });
          ////////////////////////////////////////////////////////////////////////////////

          resetScrollState();
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
              socketInstance()?.emit("get_status",friendId)
              const btn1 = await new Promise<string>((resolve) => {
                  socketInstance()?.once("blockBtn", (btn) => {
                      resolve(btn);
                  });
              });
              if(!document.getElementById("block-button") && !document.getElementById("unblock-button"))
                  document.getElementById("popup-option")!.innerHTML += generateBlockButton(btn1);
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
            const challenge: HTMLButtonElement = document.getElementById(
              "challenge-option"
            ) as HTMLButtonElement;
            //TODO handel ila blkah may9edarch yel3ab m3ah game 

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
            const textEl:HTMLParagraphElement = challenge.querySelector("p") as HTMLParagraphElement;
            const iconEl:HTMLSpanElement = challenge.querySelector("span") as HTMLSpanElement;
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
  
                socketInstance()?.emit("challenge", friendId);
  
                challenge.dataset.intervalId = String(setInterval(() => {
                  remaining--;
                  textEl.textContent = `Waiting ${remaining}s`;
                  if (remaining <= 0) {
                    clearInterval(Number(challenge.dataset.intervalId));
                    challenge.classList.remove(
                      "opacity-50",
                      "cursor-not-allowed",
                      "pointer-events-none"
                    );
                    textEl.textContent = originalText;
                    iconEl.classList.remove("opacity-0");
                  }
                }, 1000));
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
              socketInstance()?.emit("status", { status: "blocked", friendId });
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
              socketInstance()?.emit("status", { status: "accepted", friendId });
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
        }
      });
    });
  }
}
