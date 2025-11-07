import {renderNavBar} from "../components/navbar"
import {renderSidebar} from "../components/sidebar"
import {lastMsg, chatZones,listOfMsg ,DM ,sendMsg,receivedMsg,profileNav,inputMsg,choseFriend,generateBlockButton,} from "../components/content";
import {socket} from "../roomAndMsg";


let myId:string = ''; 
let imInRoom:string = ''; 

const nav = document.getElementById('nav-bar');
const sidebar = document.getElementById('side-bar');
const chatContent = document.getElementById('chat-content')



async function showMainUI()
{
    if(nav) nav.innerHTML = renderNavBar();
    if(sidebar) sidebar.innerHTML = renderSidebar();
    
    let sendButton:HTMLButtonElement;
    let chatZone:HTMLDivElement;
    let inputMsgZone:HTMLInputElement;
    let dmZone:HTMLElement | null ;

    socket.emit('con',myId);
    
    
    function fetchListOfFriends(): Promise<any> {
        return new Promise((resolve) => {
            socket.once('friends_list', (friends) => {
                // console.log(friends);
                // console.table(friends.waitingMsg); 
                resolve(friends);
            });
            socket.emit('get_friends',myId);
        });
    }

    if(chatContent){
            const friends = await fetchListOfFriends();
            chatContent.innerHTML = listOfMsg(friends.friends,friends.waitingMsg,myId);

            function moveUp(id:string){
                const container = document.getElementById('list-of-msg')
                const target = Array.from(container!.children).find(el=> el.dataset.id == id );
                if(target)
                    container?.prepend(target);

            }

            socket.on('cc',(id,roomName,msg)=>{
                if(roomName !== imInRoom)
                {
                    moveUp(id);

                    const counterElement:HTMLDivElement = document.getElementById(`counter-of-${id}`) as HTMLDivElement;
                    if(counterElement?.classList.contains('hidden'))
                        counterElement?.classList.remove('hidden')
                    let counterElementValue:number = Number(counterElement.textContent);
                    counterElement.innerText =String(++counterElementValue);
                    console.log('sssssssssssssssssssssssssssss');

                    const containerMsg = document.getElementById(`container-of-last-msg-of-${id}`)
                    console.log(containerMsg);
                    if(containerMsg)
                        containerMsg.innerHTML = lastMsg(1,msg,id)

                }
            });
            chatContent.innerHTML += DM();
            
            //get all of list friends 
            const friendsEvent = document.querySelectorAll('.friend-msg-zone');
            friendsEvent.forEach((friend)=>{
                friend.addEventListener('click',(event)=>{
                    imInRoom = friend.dataset.roomname;

                    const friendId = friend.dataset.id;
                    const friendFind = friends.friends.find(f => f.id == friendId);
                    // console.table(friendFind)
                    if(friendFind)
                    {
                        const roomName:string = [myId,friendFind.id].sort().join('_');
                        const dm = document.getElementById('DM');
                        if(dm)
                            dm.dataset.roomName = roomName;
                        // const oldRoomName = roomName;

                        
                        socket.emit('joinToRoom',roomName);

                        const counterElement:HTMLDivElement = document.getElementById(`counter-of-${friendId}`) as HTMLDivElement;
                        const lastMsgVar:HTMLSpanElement = document.getElementById(`last-msg-${friendId}`) as HTMLSpanElement;
                        if(!counterElement.classList.contains('hidden'))
                        {
                            counterElement.textContent = '0'
                            counterElement.classList.add('hidden')
                        }
                        if(lastMsgVar.classList.contains('font-semibold'))
                        {
                            lastMsgVar.classList.remove('font-semibold')
                            lastMsgVar.classList.remove('text-[#F5F5F5]')
                            lastMsgVar.classList.add('font-thin')
                            lastMsgVar.classList.add('text-[#888]')
                        }

                        // console.log(roomName);
                        //*********************************************************************** */
                        dmZone = document.getElementById("DM");
                        let contentChat = profileNav(friendFind.img,friendFind.name,friendFind.status)
                        contentChat += chatZones();
                        if(dmZone)
                            dmZone.innerHTML = contentChat;
                        const msg = document.getElementById('x');
                        socket.emit('get_status',({myId,friendId}));

                        socket.on('allowMsg',(allow:boolean)=>{
                            if(msg && allow)
                                msg.innerHTML = inputMsg('accepted');
                            else 
                                msg.innerHTML = inputMsg('blocked');
                            setupPopupEvents();
                        })
                        ////////////////////////////////////////////////////////////////////////////////
                        sendButton = document.getElementById('send-button') as HTMLButtonElement;
                        chatZone = document.getElementById('chat-zone') as HTMLDivElement;
                        inputMsgZone = document.getElementById('input-msg-zone') as HTMLInputElement;
    
                        //****************************** start popup part *************************************//
                        const option = document.getElementById('more_vert') as HTMLSpanElement;
                        const popupOption = document.getElementById('popup-option') as HTMLDivElement;
                        const blockButton = document.getElementById('block-button') as HTMLDivElement;
                        const blockOption = document.getElementById('block-option') as HTMLButtonElement;
                        const blockValid = document.getElementById('blocked-valid') as HTMLButtonElement;
                        const blockUnvalid = document.getElementById('blocked-unvalid') as HTMLButtonElement;
                        const unblockButton = document.getElementById('unblock-button') as HTMLButtonElement;
                        const unblockValid = document.getElementById('unblocked-valid') as HTMLButtonElement;
                        const unblockUnvalid = document.getElementById('unblocked-unvalid') as HTMLButtonElement;
                        const unblockOption = document.getElementById('unblock-option') as HTMLDivElement;
    
                            //When pressed 3 point
                        option.addEventListener('click',(event)=>{
                            contentChat = profileNav(friendFind.img,friendFind.name,friendFind.status)
                            if(popupOption.classList.contains("hidden"))
                                popupOption.classList.remove("hidden")
                            else
                                popupOption.classList.add("hidden")
                        })
                            // to close popup if click out of popup
                        window.addEventListener('click',(event)=>{
                            const target = event.target as HTMLElement;
                            if(!popupOption.contains(target) && !popupOption.classList.contains("hidden") && target.id !== 'more_vert' && target.id !== 'blocked-unvalid' && target.id !== 'unblocked-unvalid' )
                                popupOption.classList.add("hidden")
                            if(!blockOption.contains(target)  && !blockOption.classList.contains("hidden") && !target.classList.contains('block-button-class'))
                                blockOption.classList.add("hidden")
                            if(!unblockOption.contains(target)  && !unblockOption.classList.contains("hidden") && !target.classList.contains('unblock-button-class'))
                                unblockOption.classList.add("hidden")
                        })
                            // if chose block button show popup of block option
                        if(blockButton){
                            blockButton.addEventListener('click',()=>{
                                popupOption.classList.remove('hidden');
                                blockOption.classList.remove('hidden');
                            })
                        }
                        
                        if(unblockButton){
                            unblockButton.addEventListener('click',()=>{
                                popupOption.classList.remove('hidden')
                                unblockOption.classList.remove('hidden');
                            })
                        }
                        
                        //block behaver
    
                        function setupPopupEvents(){ //Ai
                            const blockButton = document.getElementById("block-button");
                            const unblockButton = document.getElementById("unblock-button");
                            const blockOption = document.getElementById("block-option");
                            const unblockOption = document.getElementById("unblock-option");
                            const sendButton = document.getElementById('send-button') as HTMLButtonElement;
                            const inputMsgZone = document.getElementById('input-msg-zone') as HTMLInputElement;
    
                            if (blockButton && blockOption) {
                                blockButton.addEventListener("click", () => blockOption.classList.remove("hidden"));
                            }
    
                            if (unblockButton && unblockOption) {
                                unblockButton.addEventListener("click", () => unblockOption.classList.remove("hidden"));
                            }
                            if(sendButton)
                            {
                                function send_message()
                                {
                                    const value:string = inputMsgZone.value;
                                    if(value.trim())
                                    {
                                        chatZone.innerHTML +=  sendMsg(value);
                                        const friendId:string = friendFind.id;
                                        socket.emit('send_message',{value,myId,friendId});
                                        moveUp(friendId)
                                        const container = document.getElementById(`container-of-last-msg-of-${friendFind.id}`)
                                        // console.log(container);
                                        if(container)
                                            container.innerHTML = lastMsg(3,value,friendFind.id)
                                    }
                                    inputMsgZone.value  = "";
                                
                                }
                                sendButton.addEventListener('click',()=>{
                                    send_message();
                                })
                                inputMsgZone.addEventListener('keypress',(e)=>{
                                    if(e.key === 'Enter')
                                        send_message();
                                })
                            }
                        }
    
    
                        blockValid.addEventListener('click', () => {
                            socket.emit('status', { status: 'blocked', user_id: myId, friend_id: friendId });
                            blockOption.classList.add("hidden");
                            const popupOption = document.getElementById("popup-option"); 
                            if (popupOption) {
                                popupOption.innerHTML = `
                                    <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                                        <p>Challenge</p>
                                        <span class="material-symbols-outlined">swords</span>
                                    </div>
                                    ${generateBlockButton('blocked')}
                                `;
                            }
                            setupPopupEvents();
                        });
                        socket.on('x',(roomName,statusGlobal)=>{
                            const dm = document.getElementById('DM');
                            if(dm.dataset.roomName == roomName)
                            {
                                    const msg = document.getElementById('x');
                                    if(msg)
                                        msg.innerHTML = inputMsg(statusGlobal);
                                    setupPopupEvents();
                            }
                        })
                        blockUnvalid.addEventListener('click',()=>{
                            blockOption.classList.add('hidden');
                            popupOption.classList.remove('hidden')
    
                        })
                            //unblock behaver
                        unblockValid.addEventListener('click',()=>{
                            socket.emit('status',{status: 'accepted',user_id:myId,friend_id:friendId})
                            unblockOption.classList.add("hidden");
                            const popupOption = document.getElementById("popup-option");
                            if (popupOption) {
                                popupOption.innerHTML = `
                                    <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                                        <p>Challenge</p>
                                        <span class="material-symbols-outlined">swords</span>
                                    </div>
                                    ${generateBlockButton('accepted')}
                                `;
                            }
                            setupPopupEvents();
                        })
                        unblockUnvalid.addEventListener('click',()=>{
                            unblockOption.classList.add('hidden');
                            popupOption.classList.remove('hidden');
                        })
                        //
                        //****************************** end popup part *************************************//
    
        
                        if(sendButton)
                        {
                            function send_message()
                            {
                                const value:string = inputMsgZone.value;
                                if(value.trim())
                                {
                                    chatZone.innerHTML +=  sendMsg(value);
                                    socket.emit('send_message',{value ,roomName,myId,friendFind});
                                    moveUp(friendFind.id)
                                    const container = document.getElementById(`container-of-last-msg-of-${friendFind.id}`)
                                    console.log(container);
                                    if(container)
                                        container.innerHTML = lastMsg(3,value,friendFind.id)

                                }
                                inputMsgZone.value  = "";
                            
                            }
                            sendButton.addEventListener('click',()=>{
                                send_message();
                            })
                            inputMsgZone.addEventListener('keypress',(e)=>{
                                if(e.key === 'Enter')
                                        send_message();
                            })
                        }
                    }
                })
            })
    }
    
    // hena fach kanberi nkherg mn DM m3and chi wahed 
    window.addEventListener('keydown',(e)=>{
        if(e.key === 'Escape')
        {
            //TODO handel if exit set imInRoom = '';
            imInRoom = '';
            if(dmZone) dmZone.innerHTML = choseFriend();
        }
    })
    
    
    
    // hena fach kayweslni msg
    socket.on('receive_message',(msg,friendId)=>{
        // console.log('wawawawaw');
        // if(myId == data.friendId){
            chatZone.insertAdjacentHTML("beforeend", receivedMsg(msg));
            console.log('sssssssssssssssssssssssssssss');
            const container = document.getElementById(`container-of-last-msg-of-${friendId}`)
            console.log(container);
            if(container)
                container.innerHTML = lastMsg(2,msg,friendId)
        // }
    })
    socket.on('aji_message',(msg)=>{
        // if(myId == data.friendId){
            // chatZone.insertAdjacentHTML("beforeend", receivedMsg(msg));
            chatZone.innerHTML +=  sendMsg(msg);
        // }
    })

}















chatContent!.innerHTML = `
  <div id="user-choice" class="flex flex-col items-center justify-center h-full text-white">
    <p class="text-xl mb-3">ID</p>
    <input class="text-white" id="username-input" type="text" placeholder="Enter username"
      class="p-2 rounded mb-3 text-black w-[200px] text-center"/>
    <div class="flex gap-5">
      <button id="yes-btn" class="bg-green-600 px-4 py-2 rounded">ok</button>
    </div>
  </div>
`;

const yesBtn = document.getElementById('yes-btn')!;
const usernameInput = document.getElementById('username-input') as HTMLInputElement;
const userChoice = document.getElementById('user-choice');

yesBtn.addEventListener('click', () => {
    const name = usernameInput.value.trim();
    myId = name;
    if (userChoice) userChoice.remove();
    showMainUI();
});

