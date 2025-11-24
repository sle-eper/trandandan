import { renderNavBar } from "../components/navbar";
import { renderSidebar } from "../components/sidebar";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");


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

let myId: string = "";
let myImg: string = "";
let imInRoom: string = "";
let friendId: string = "";

// const app = document.getElementById('login-app');
// if(app)
// {
//     app.innerHTML = `<div id="nav-bar"></div>
//                     <div id="layout" class="flex flex-row  h-[calc(100vh-4rem)]" >
//                     <div id="side-bar" ></div>
//                     <div id="chat-content" class="flex justify-center items-center w-full gap-6 h-[93vh] gap-y-3"></div>
//                     </div>` 
// }

// const nav = document.getElementById("nav-bar");
// const sidebar = document.getElementById("side-bar");
// const chatContent = document.getElementById("chat-content");


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
    const inputMsgZone = document.getElementById(
        "input-msg-zone"
    ) as HTMLInputElement;

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
    function getTime():string
    {
        const date = new Date()
        const h:string = date.getHours().toString().padStart(2,'0');
        const m:string = date.getMinutes().toString().padStart(2,'0');
        return `${h}:${m}`

    }
    if (sendButton) {
        function send_message() {
            const value: string = inputMsgZone.value;
            if (value.trim()) {
                const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
                const msgTime = document.getElementById(`time-of-msg-${friendId}`)
                const time = getTime();
                chatZone.innerHTML += sendMsg(value,time,myImg);

                // const friendId:string = friendFind.id;
                socket.emit("send_message", { value, myId, friendId });
                moveUp(friendId);
                const container = document.getElementById(
                    `container-of-last-msg-of-${friendId}`
                );
                chatZone.scrollTop = chatZone.scrollHeight
                if (container) container.innerHTML = lastMsg('send', value, friendId);
                if(msgTime) msgTime.innerHTML = time
            }
            inputMsgZone.value = '';
            inputMsgZone.style.height = 'auto';//TODO nsayeb dak input 
        }
        sendButton.addEventListener("click", () => {
            send_message();
        });
        inputMsgZone.addEventListener("keypress", (e) => {
            if (e.key === "Enter") send_message();
        });
    }
}

function socketListener() {
    socket.on("live", (id, roomName, msg,timeOfMsg) => {
        moveUp(id);
        console.log("id",id);
        const timeOfMsgSpan:HTMLSpanElement = document.getElementById(`time-of-msg-${id}`) as HTMLSpanElement
        if (roomName !== imInRoom) {

            const counterElement: HTMLDivElement = document.getElementById(
                `counter-of-${id}`
            ) as HTMLDivElement;
            // console.log(timeOfMsgSpan)
            if (counterElement?.classList.contains("hidden"))
                counterElement?.classList.remove("hidden");

            let counterElementValue: number = Number(counterElement.textContent);
            ++counterElementValue
            if(counterElementValue <= 9)
                counterElement.innerText = String(counterElementValue);//TODO handel 9+ msg
            else if(counterElementValue > 9)
                counterElement.innerText = '+9'
            const containerMsg = document.getElementById(
                `container-of-last-msg-of-${id}`
            );
            if (containerMsg) containerMsg.innerHTML = lastMsg('recv', msg, id);
            if(timeOfMsgSpan) timeOfMsgSpan.innerText = timeOfMsg 
        }
    });
    socket.on("receive_message", (msg, msgId ,friendId,timeOfMsg,friendImg) => {
        const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
        chatZone.insertAdjacentHTML("beforeend", receivedMsg(msg,timeOfMsg,friendImg));

        socket.emit('ack_message',msgId)
        const container = document.getElementById(
            `container-of-last-msg-of-${friendId}`
        );
        // if (container) container.innerHTML = lastMsg('recv', msg, friendId);
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
    socket.on('messages_batch',(messages,friendImg)=>{
        const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
        for(const msg of messages){
            if (msg.send == myId)
                chatZone.insertAdjacentHTML("beforeend", sendMsg(msg.msg,msg.time,myImg));
            else
                chatZone.insertAdjacentHTML("beforeend", receivedMsg(msg.msg,msg.time,friendImg));
        }
        requestAnimationFrame(() => {
                chatZone.scrollTop = chatZone.scrollHeight;
            });
    });
    socket.on('messages_old_batch',(messages,friendImg)=>{
        const chatZone = document.getElementById("chat-zone") as HTMLDivElement;
        for(const msg of messages){
            if(msg.send == myId)
                chatZone.insertAdjacentHTML('afterbegin', sendMsg(msg.msg,msg.time,myImg)); 
            else
                chatZone.insertAdjacentHTML("afterbegin", receivedMsg(msg.msg,msg.time,friendImg));
        }
    
    });
    socket.on('setIMg',(img)=>{
        // console.log("sasasasa",BACKEND_URL)
        myImg = img;
    })
}

export async function showMainUI() {
    // const bodyElement = document.getElementById('myBody')
    // if(bodyElement)
    // {
    //     console.log(bodyElement)
    //     /*     ') */
    //     bodyElement.classList.remove('bg-black') /*  flex flex-col md:flex-row items-center justify-center min-h-screen px-6 md:px-20') */
    //     bodyElement.classList.remove('text-white') /* text-white  flex-col md:flex-row items-center justify-center min-h-screen px-6 md:px-20') */
    //     bodyElement.classList.remove('flex') 
    //     bodyElement.classList.remove('flex-col') 
    //     bodyElement.classList.remove('md:flex-row') 
    //     bodyElement.classList.remove('items-center') 
    //     bodyElement.classList.remove('min-h-screen') 
    //     bodyElement.classList.remove('px-6') 
    //     bodyElement.classList.remove('md:px-20') 
    //     bodyElement.classList.add('bg-gradient-to-b from-[#0E0E0E] to-[#1A1A1A]')

    // }
    const app = document.getElementById('login-app');
    if(app)
    {
        app.innerHTML = `<div id="nav-bar"></div>
                        <div id="layout" class="flex flex-row  h-[calc(100vh-4rem)]" >
                        <div id="side-bar" ></div>
                        <div id="chat-content" class="flex justify-center items-center w-full gap-6 h-[93vh] gap-y-3"></div>
                        </div>` 
    }

    const nav = document.getElementById("nav-bar");
    const sidebar = document.getElementById("side-bar");
    const chatContent = document.getElementById("chat-content");

    if (nav) nav.innerHTML = renderNavBar();
    if (sidebar) sidebar.innerHTML = renderSidebar();

    let sendButton: HTMLButtonElement;
    let chatZone: HTMLDivElement;
    let inputMsgZone: HTMLInputElement;
    let dmZone: HTMLElement | null;

    socket.emit("con", myId);

    function fetchListOfFriends(): Promise<any> {
        return new Promise((resolve) => {
            socket.once("friends_list", (friends) => {
                resolve(friends);
            });
            socket.emit("get_friends", myId);
        });
    }

    if (chatContent) {
        const friends = await fetchListOfFriends();
        chatContent.innerHTML = listOfMsg(friends.friends,friends.waitingMsg,myId);
        chatContent.innerHTML += DM();

        //get all of list friends
        const friendsEvent = document.querySelectorAll(".friend-msg-zone");
        friendsEvent.forEach((friend) => {
            friend.addEventListener("click", (event) => {
            /******************************************get msg on scroll*******************************/
            let firestOne:boolean = false 
            let isFetching = false;
            function onScroll()
            {
                let offset:number = 0;
                if(!firestOne)
                {
                    socket.emit('get_messages',{myId,friendId,limit: 20, offset})
                    firestOne = true;
                }
                const chatZone = document.getElementById('chat-zone');
                if(chatZone)
                {
                    chatZone.addEventListener('scroll',async()=>{
                        if(chatZone.scrollTop < 190  && !isFetching )
                        {
                            isFetching = true;
                            offset += 20;
                            await socket.emit('get_old_messages',{myId,friendId,limit: 20, offset})
                            isFetching = false;
                        }
                    })
                }
            }
                /**********************************************************************************************/

                imInRoom = friend.dataset.roomname;
                friendId = friend.dataset.id;

                const friendFind = friends.friends.find(f => f.id == friendId);
                // console.table(friendFind);
                if (friendFind) {
                    const roomName: string = [myId, friendFind.id].sort().join("_");
                    const dm = document.getElementById("DM");
                    if (dm) dm.dataset.roomName = roomName;
                    // socket.emit('get_messages',{myId,friendId,limit: 20, offset: 0})//TODO MAZL KHASEHA TFEHAM 
                    socket.emit("joinToRoom", roomName);

                    const counterElement: HTMLDivElement = document.getElementById(`counter-of-${friendId}`) as HTMLDivElement;
                    const lastMsgVar: HTMLSpanElement = document.getElementById(`last-msg-${friendId}`) as HTMLSpanElement;
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
                    let contentChat = profileNav(
                        friendFind.img,
                        friendFind.name,
                        friendFind.status
                    );
                    contentChat += chatZones();
                    if (dmZone) dmZone.innerHTML = contentChat;
                    socket.emit("get_status", { myId, friendId });
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
                    const option = document.getElementById(
                        "more_vert"
                    ) as HTMLSpanElement;
                    const popupOption = document.getElementById(
                        "popup-option"
                    ) as HTMLDivElement;
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

                    //When pressed 3 point
                    option.addEventListener("click", (event) => {
                        contentChat = profileNav(
                            friendFind.img,
                            friendFind.name,
                            friendFind.status
                        );
                        if (popupOption.classList.contains("hidden"))
                            popupOption.classList.remove("hidden");
                        else popupOption.classList.add("hidden");
                    });
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
                        socket.emit("status", {
                            status: "blocked",
                            user_id: myId,
                            friend_id: friendId,
                        });
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
                        socket.emit("status", {
                            status: "accepted",
                            user_id: myId,
                            friend_id: friendId,
                        });
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
                    //
                    //****************************** end popup part *************************************//
                }
            });
        });
    }
}
socketListener();

// chatContent!.innerHTML = `
//   <div id="user-choice" class="flex flex-col items-center justify-center h-full text-white">
//     <p class="text-xl mb-3">ID</p>
//     <input class="text-white" id="username-input" type="text" placeholder="Enter username"
//       class="p-2 rounded mb-3 text-black w-[200px] text-center"/>
//     <div class="flex gap-5">
//       <button id="yes-btn" class="bg-green-600 px-4 py-2 rounded">ok</button>
//     </div>
//   </div>
// `;

// const yesBtn = document.getElementById("yes-btn")!;
// const usernameInput = document.getElementById(
//     "username-input"
// ) as HTMLInputElement;
// const userChoice = document.getElementById("user-choice");

// yesBtn.addEventListener("click", () => {
//     const name = usernameInput.value.trim();
//     myId = name;
//     if (userChoice) userChoice.remove();
//     showMainUI();
// });
