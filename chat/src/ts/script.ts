import {renderNavBar} from "../components/navbar"
import {renderSidebar} from "../components/sidebar"
import { listOfMsg ,DM ,sendMsg,receivedMsg} from "../components/content";
import {socket} from "../roomAndMsg";

// console.log(`my socket id ${}`)
const nav = document.getElementById('nav-bar');
const sidebar = document.getElementById('side-bar');
const chatContent = document.getElementById('chat-content')

if(nav) nav.innerHTML = renderNavBar();
if(sidebar) sidebar.innerHTML = renderSidebar();

if(chatContent){
    const friends = [
        { name: "Lana", lastMessage: "3mer lbota", time: "13:10", img: "./src/img/1_Ss70nvjqEXusREvoyutFuA.jpg" },
        { name: "Yassine", lastMessage: "salam bro", time: "14:22", img: "./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp" },
        { name: "daniala", lastMessage: "wach rak", time: "15:03", img: "./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg" },
    ]
    chatContent.innerHTML = listOfMsg(friends);
    chatContent.innerHTML += DM('./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp','hassan');
}
const sendButton = document.getElementById('send-button') as HTMLButtonElement;
const chatZone = document.getElementById('chat-zone') as HTMLDivElement
const inputMsgZone = document.getElementById('input-msg-zone') as HTMLInputElement;


if(sendButton)
{
    function seft()
    {
        const value:string = inputMsgZone.value;
        if(value.trim())
            chatZone.innerHTML +=  sendMsg(value);
        inputMsgZone.value  = "";
    
    }
    sendButton.addEventListener('click',()=>{
        seft();
    })
    inputMsgZone.addEventListener('keypress',(e)=>{
        if(e.key === 'Enter')
                seft();
    })
}
socket.on('sendMsg',(msg)=>{
})
socket.on('msg',(msg)=>{
    chatZone.innerHTML += receivedMsg(msg)
    console.log("walo");

})