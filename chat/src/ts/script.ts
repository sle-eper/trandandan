import {renderNavBar} from "../components/navbar"
import {renderSidebar} from "../components/sidebar"
import { chatZones,listOfMsg ,DM ,sendMsg,receivedMsg,profileNav,inputMsg,choseFriend} from "../components/content";
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
                console.table(friends)
                myResolve(friends);
            })
        }
    })
}

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
                if(friendFind)
                {
                    const roomName = ['0',friendId].sort().join('_');
                    socket.emit('joinToRoom',roomName);
                    console.log(roomName);
                    dmZone = document.getElementById("DM");
                    let contentChat = profileNav(friendFind.img,friendFind.name)
                    contentChat += chatZones();
                    contentChat += inputMsg();
                    if(dmZone)
                        dmZone.innerHTML = contentChat;
                    sendButton = document.getElementById('send-button') as HTMLButtonElement;
                    chatZone = document.getElementById('chat-zone') as HTMLDivElement;
                    inputMsgZone = document.getElementById('input-msg-zone') as HTMLInputElement;

                    // popup part
                    const option = document.getElementById('more_vert') as HTMLSpanElement;
                    const popupOption = document.getElementById('popup-option') as HTMLDivElement;
                    option.addEventListener('click',(event)=>{
                        if(popupOption.classList.contains("hidden"))
                            popupOption.classList.remove("hidden")
                        else
                            popupOption.classList.add("hidden")
                    })
                    window.addEventListener('click',(event)=>{
                        const target = event.target as HTMLElement;
                        if(!popupOption.contains(target) && !popupOption.classList.contains("hidden") && event.target.id !== 'more_vert' )
                            popupOption.classList.add("hidden")
                    })
                    //
    
    
                    if(sendButton)
                    {
                        function send_message()
                        {
                            const value:string = inputMsgZone.value;
                            if(value.trim())
                            {
                                chatZone.innerHTML +=  sendMsg(value);
                                socket.emit('send_message',value,roomName);
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