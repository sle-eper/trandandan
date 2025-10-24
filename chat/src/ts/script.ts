import {renderNavBar} from "../components/navbar"
import {renderSidebar} from "../components/sidebar"
import { chatZones,listOfMsg ,DM ,sendMsg,receivedMsg,profileNav,inputMsg,choseFriend} from "../components/content";
import {socket} from "../roomAndMsg";

socket.on('connect',()=>{
    console.log("✅ Connected:", socket.id)
    socket.emit('register',{
    userName:'ayoub',
    img:'./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp',
    id:'0'
})
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

if(chatContent){
    const friends = [
        { name: "Lana", lastMessage: "3mer lbota", time: "13:10", img: "./src/img/1_Ss70nvjqEXusREvoyutFuA.jpg",id:"1" },
        { name: "Yassine", lastMessage: "salam bro", time: "14:22", img: "./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp",id:"2" },
        { name: "daniala", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"3" },
        { name: "sekfekf", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"4" },
        { name: "hafozli9", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"5" },
        { name: "chakhesiya", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"6" },
        { name: "lmlafeta", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"7" },
        { name: "lmlafet2", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"7" },
        { name: "lmlafet2", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg",id:"7" },
    ]
    chatContent.innerHTML = listOfMsg(friends);
    chatContent.innerHTML += DM();
    const friendsEvent = document.querySelectorAll('.friend-msg-zone');

    friendsEvent.forEach((friend)=>{
        friend.addEventListener('click',(event)=>{
            const friendId = friend.dataset.id;
            const friendFind = friends.find(f => f.id === friendId);
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
            console.log(friendId);
        })
    })
}

window.addEventListener('keydown',(e)=>{
    if(e.key === 'Escape')
    {
        if(dmZone) dmZone.innerHTML = choseFriend();
    }
})

// console.log(sendButton);

socket.on('receive_message',(msg)=>{
    chatZone.insertAdjacentHTML("beforeend", receivedMsg(msg));
})