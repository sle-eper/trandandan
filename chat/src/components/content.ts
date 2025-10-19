import {socket} from "../roomAndMsg";



function friendCart(friend:{name: string; lastMessage: string; time: string; img: string}):string //done 
{
    return `<div id="msg-zone" class="flex justify-center  p-5 hover:bg-[#222222] transition-colors duration-300"">
                <div id="friend-msg-zone " class="flex w-[90%] hover:cursor-pointer ">
                    <div id="" class="">
                        <img src="${friend.img}" alt="" class="h-14 w-14 rounded-[50%]">
                    </div>
                <div class="ml-4 w-full flex flex-col justify-center">
                    <span class="font-semibold text-[#F5F5F5]">lana</span>
                    <div class="flex justify-between items-center ">
                        <span class=" font-thin flex-grow  truncate  text-[#888]" >${friend.lastMessage}</span>
                        <span class="text-sm text-[#888] text-right "> ${friend.time}</span>
                    </div>
                    </div>
                </div>
            </div>`
}


export function listOfMsg(friends: {name: string; lastMessage: string; time: string; img: string;}[]): string //done
{
    const friendCards = friends.map(element => friendCart(element)).join('\n')
    return `
        <div id = "list-of-msg" class="w-[25%] h-[90%] rounded-2xl bg-[#181818]  overflow-y-auto shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A]" >
            <div class="sticky top-0 z-10 bg-[#181818] p-6">
                <h1 class="font-bold text-[#F5F5F5]">chat</h1>
            </div>
            ${friendCards}
        </div>`;
}
/* ****************************************************************************************************************************************************************** */



function profileNav(img:string,userAccount:string):string{
    return`
        <div id="profile-nav" class="flex h-[10%] items-center p-5 justify-between">
            <div class="flex items-center gap-6">
                <img src="${img}" alt="" class="h-10 w-10 rounded-full ">
                <span class='font-semibold text-[#F5F5F5]'>${userAccount}</span>
            </div>
                <span class="material-symbols-outlined text-[#E63946]">report</span>
            </div>
        <div class="h-[2px] bg-gradient-to-r from-[#E63946] to-[#8A1C1C]"></div>`
}

function inputMsg():string //done
{
    return `<div id="input-msg" class="h-15 border-[#E63946] rounded-xl border-2 flex items-center mt-2">
            <input type="text" placeholder="Message..." id="input-msg-zone" class="h-[100%] w-[95%] text-[#F5F5F5] p-5 focus:outline-none">
            <button id="send-button" class="bg-gradient-to-br from-[#E63946] to-[#8A1C1C] hover:from-[#FF4D4D] hover:to-[#A02020] rounded-xl w-[5%] h-[80%] mr-2 ml-4 flex justify-center items-center">
                <span class="material-symbols-outlined text-white">send</span>
            </button>
            </div>`
}

export function sendMsg(msg:string):string{
    
    socket.emit('sedMsg',msg);
    return `<div id="sent-msg" class="flex mt-5 h-auto w-[65%] justify-start pl-5 ">
                <img src="./src/img/360_F_382662173_NY65DAzJmdYGzWrfFcPsNLN6zAjbsdM6.jpg" alt="" class="h-10 w-10 rounded-full mt-2 mr-2">
                <div id="content-sent" class="max-w-[80%] flex flex-col">
                    <div  class="border-2 border-[#E63946] rounded-xl p-3  ">
                        <span class="text-[#F5F5F5]">
                            ${msg}
                        </span>
                    </div>
                <span id="text-sent-time " class="text-xs text-[#888] mt-1">1:15</span>
                </div>
            </div>`
}


export function receivedMsg(msg:string):string{

    return `<div id="received-msg" class="flex mt-5 h-auto w-[65%]  justify-end ml-auto pr-5">
    <div id="content-received" class="max-w-[80%] flex flex-col ">
        <div id="text-received" class=" bg-[#E63946] rounded-xl p-3 ">
        <span class="text-[#F5F5F5]">
            ${msg}
        </span>
        </div> 
        <span id="text-received-time " class="text-xs text-[#888] mt-1 self-end">1:16</span>
    </div>
    <img src="./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp" alt="" class="h-10 w-10 rounded-full mt-2 ml-2">
    </div>`
    
}


function chatZone():string{
    return`<div id="chat-zone" class="flex flex-col h-[100%] overflow-y-auto hide-scrollbar">
            </div>`
}




export function DM(img:string,userAccount:string):string{
    return`
    <div id="DM" class="w-[55%] h-[90%] rounded-2xl p-4 flex flex-col bg-[#181818] shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A]">
        ${profileNav(img,userAccount)}
        ${chatZone()}
        ${inputMsg()}
    </div>
            `;
}