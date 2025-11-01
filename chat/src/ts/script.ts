import {renderNavBar} from "../components/navbar"
import {renderSidebar} from "../components/sidebar"
import { chatZones,listOfMsg ,DM ,sendMsg,receivedMsg,profileNav,inputMsg,choseFriend,generateBlockButton} from "../components/content";
import {socket} from "../roomAndMsg";
// import {getFriendsOfUser,getMyId} from "../db/databse"

// const wa3 = getFriendsOfUser(getMyId('Ayoub'));
// console.log(wa3);

socket.on('connect',()=>{
    console.log("✅ Connected:", socket.id)
    socket.emit('register',{
    userName:'ayoub',
    img:'./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp',
    id:'0'
})
    socket.emit('get_friends', { name: 'Ayoub' });
})



const nav = document.getElementById('nav-bar');
const sidebar = document.getElementById('side-bar');
const chatContent = document.getElementById('chat-content')

if(nav) nav.innerHTML = renderNavBar();
if(sidebar) sidebar.innerHTML = renderSidebar();

let sendButton:HTMLButtonElement;
let chatZone:HTMLDivElement;
let inputMsgZone:HTMLInputElement;
let dmZone:HTMLElement | null ;


function fetchListOfFriends()
{
    return new Promise((myResolve)=>{
        if(chatContent)
        {
             socket.on('friends_list',(friends)=>{
                // console.table(friends)
                myResolve(friends);
            })
        }
    })
}
const myId:string = '1' 
if(chatContent){
    fetchListOfFriends().then((friends)=>{
        chatContent.innerHTML = listOfMsg(friends);
        chatContent.innerHTML += DM();
        //get all of list friends 
        const friendsEvent = document.querySelectorAll('.friend-msg-zone');
        // add click event 
        friendsEvent.forEach((friend)=>{
            friend.addEventListener('click',(event)=>{
                const friendId = friend.dataset.id;
                const friendFind = friends.find(f => f.id == friendId);
                // console.table(friendFind)
                if(friendFind)
                {
                    const roomName = [myId,friendId].sort().join('_');
                    socket.emit('joinToRoom',roomName);
                    console.log(roomName);
                    //*********************************************************************** */
                    dmZone = document.getElementById("DM");
                    let contentChat = profileNav(friendFind.img,friendFind.name,friendFind.status)
                    contentChat += chatZones();
                    if(dmZone)
                        dmZone.innerHTML = contentChat;
                    const msg = document.getElementById('x');
                    if(msg)
                        msg.innerHTML = inputMsg(friendFind.status);
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
                        console.log(sendButton);
                        if(sendButton)
                        {
                            console.log('hiiii');
                            function send_message()
                            {
                                const value:string = inputMsgZone.value;
                                if(value.trim())
                                {
                                    chatZone.innerHTML +=  sendMsg(value);
                                    socket.emit('send_message',{value ,roomName,myId,friendFind});
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
                        friendFind.status = 'blocked';
                        const msg = document.getElementById('x');
                        if(msg)
                            msg.innerHTML = inputMsg(friendFind.status);
                        const popupOption = document.getElementById("popup-option"); 
                        if (popupOption) {
                            popupOption.innerHTML = `
                                <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                                    <p>Challenge</p>
                                    <span class="material-symbols-outlined">swords</span>
                                </div>
                                ${generateBlockButton(friendFind.status)}
                            `;
                        }
                        setupPopupEvents();
                    });

                    blockUnvalid.addEventListener('click',()=>{
                        blockOption.classList.add('hidden');
                        popupOption.classList.remove('hidden')

                    })
                        //unblock behaver
                    unblockValid.addEventListener('click',()=>{
                        socket.emit('status',{status: 'accepted',user_id:myId,friend_id:friendId})
                        unblockOption.classList.add("hidden");
                        friendFind.status = 'accepted';

                        const msg = document.getElementById('x');
                        if(msg)
                            msg.innerHTML = inputMsg(friendFind.status);

                        const popupOption = document.getElementById("popup-option");
                        if (popupOption) {
                            popupOption.innerHTML = `
                                <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                                    <p>Challenge</p>
                                    <span class="material-symbols-outlined">swords</span>
                                </div>
                                ${generateBlockButton(friendFind.status)}
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

    })
}

// hena fach kanberi nkherg mn DM m3and chi wahed 
window.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape')
    {
        if(dmZone) dmZone.innerHTML = choseFriend();
    }
})



// hena fach kayweslni msg
socket.on('receive_message',(msg)=>{
    chatZone.insertAdjacentHTML("beforeend", receivedMsg(msg));
})