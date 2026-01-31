import { getFriendId,getCurrentUserId } from "./global_var";
import { getSocketInstance } from "../../../socket_manager/socket"
import { sendMsg, lastMsg } from "../components/content";

export function moveUp(id: string) {
    const container = document.getElementById("list-of-msg");
    if (!container) return;
    const target = Array.from(container.children).find(
        (el: any) => el.dataset.id == id
    );
    if (target) container?.prepend(target);
}

export function renderConnectionError(container: HTMLElement) {
  container.innerHTML = `
        <div
            id="chat-alert-root"
            class="fixed top-30 left-1/2 -translate-x-1/2  z-[9999]
            flex justify-center items-center gap-3 rounded-2xl
            bg-[#1a1a1a]/90 border border-[#FD1D1D]/40 p-3 hidden"
        >
      </div>
    <div class="text-[#F5F5F5] flex flex-col justify-center items-center h-full gap-2">
      <div class="border border-[#ff4d4d] rounded-full h-15 w-15 flex justify-center items-center">
        <span class="material-symbols-outlined text-[#ff4d4d]">error</span>
      </div>

      <h1 class="text-xl font-semibold">Connection error</h1>

      <h2 class="text-[#888] text-center">
        Unable to connect to the chat server.<br />
        Please try again.
      </h2>
    </div>
  `;
}


export function setupPopupEvents() {
    //Ai
    const friendId = getFriendId();
    const blockButton = document.getElementById("block-button");
    const unblockButton = document.getElementById("unblock-button");
    const blockOption = document.getElementById("block-option");
    const unblockOption = document.getElementById("unblock-option");
    const sendButton = document.getElementById("send-button") as HTMLButtonElement;
    const challenge: HTMLButtonElement = document.getElementById("challenge-option") as HTMLButtonElement;
    

    if (challenge && challenge.dataset.click) { 
            challenge.dataset.click = undefined;
    }

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
        function showToast(message: string, duration = 3000) {
            const container = document.getElementById("err-display");
            if (!container) return;
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
            setTimeout(() => {
                notif.remove();
            }, duration);
        }

        function send_message() {
            const value: string = textarea.value;
            if (value.trim()) {
                if (value.length > 2000) {
                    showToast("You cannot send more than 2000 characters");
                    return;
                }

                const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
                const msgTime = document.getElementById(`time-of-msg-${friendId}`);
                const time = getTime();
                chatZone.innerHTML += sendMsg(value, time);
                getSocketInstance()?.emit("send_message", { value, userID: getCurrentUserId(), friendId });
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

export function addMenuNotification(
    icon: string,
    text: string,
    notifId: string
) {
    const notification = document.getElementById("notification-menu");
    if (!notification) return;
    const notifIcon = document.getElementById("notif-icon");
    if (!notifIcon) return;
    notifIcon.innerHTML = `<span class="text-[#E63946]   material-symbols-outlined">
                            notifications_unread
                            </span>`;

    notification.classList.remove("hidden");

    const msgNotif: HTMLDivElement = document.createElement("div");
    msgNotif.className = `
    w-full text-left px-4 py-2 text-white/90
    hover:bg-[#E63946]/20 transition rounded-lg
    `;

    msgNotif.innerHTML = `
    <div class="flex justify-between items-center">
        <span class="block max-w-70 truncate">
        ${icon} ${text}
        </span>
        <span class="hover:cursor-pointer close-btn material-symbols-outlined">close</span>
        </div>
        `;
    msgNotif.querySelector(".close-btn")?.addEventListener("click", () => {
        getSocketInstance()?.emit("removeNotif", notifId);
        msgNotif.remove();

        if (notification.children.length === 0) {
            if (notification.classList.contains("hidden")) return;
            notification.classList.add("opacity-0");
            notification.classList.add("hidden");
            notifIcon.innerHTML = `<span class="  material-symbols-outlined">
                            notifications
                            </span>`;
        }
    });

    notification.prepend(msgNotif);
}

let firestOne: boolean;
let isFetching: boolean;

export function resetScrollState() {
    firestOne = false;
    isFetching = false;
}

export function onScroll() {
    const friendId = getFriendId();
    const userID = getCurrentUserId();
    let offset: number = 0;
    if (!firestOne) {
        getSocketInstance()?.emit("get_messages", { userID, friendId, limit: 20, offset });
    firestOne = true;
    }
    const chatZone = document.getElementById("chat-zone");
    if (chatZone) {
    chatZone.addEventListener("scroll", async () => {
        if (chatZone.scrollTop < 190 && !isFetching) {
        isFetching = true;
        offset += 20;
        await getSocketInstance()?.emit("get_old_messages", {
            userID,
            friendId,
            limit: 20,
            offset,
        });
        isFetching = false;
        }
    });
    }
}

export   function fetchListOfFriends(): Promise<any> {
    return new Promise((resolve) => {
      getSocketInstance()?.once("friends_list", (friends:any[]) => {
        resolve(friends);
      });
      getSocketInstance()?.emit("get_friends");
    });
  }