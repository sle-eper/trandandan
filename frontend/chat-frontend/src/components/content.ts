
export function lastMsg(status:string,msg:string,friendId:string):string
{
    if(!msg)
        return `<span id='last-msg-${friendId}' class=" font-thin flex-grow  truncate  text-[#888]" > new friend </span>`
    const shortMsg = msg.length > 10 ? msg.slice(0,10) + '...' : msg
    if(status === 'recv')
        return `<span id='last-msg-${friendId}' class=" font-semibold flex-grow  truncate  text-[#F5F5F5]" > ${shortMsg} </span>`
    if(status === 'seen')
    {
        return `<span id='last-msg-${friendId}' class=" font-thin flex-grow  truncate  text-[#888]" > ${shortMsg} </span>`
    }
    if(status === 'send')
        return `<span id='last-msg-${friendId}' class=" font-thin flex-grow  truncate  text-[#888]" > You: ${shortMsg} </span>`
    return ''
}

function msgTime(send_at:string):string
{
    if(send_at)
        return `${send_at}`
    return ''

}

export function unreadMsgNumber(nbr:number,friendId:string):string
{
    if(nbr == 0)
        return `<div id="counter-of-${friendId}" class=" hidden text-[#F5F5F5] text-sm flex items-center justify-center rounded-full h-5 w-5 bg-[#E63946]">${nbr}</div>`
    if(nbr <= 9)
        return `<div id="counter-of-${friendId}" class="text-[#F5F5F5] text-sm flex items-center justify-center rounded-full h-5 w-5 bg-[#E63946]">${nbr}</div>`
    else
        return `<div id="counter-of-${friendId}" class="text-[#F5F5F5] text-sm flex items-center justify-center rounded-full h-5 w-5 bg-[#E63946]">+9</div>`
}


function  friendCart(friend:any,waitingMsg:object,myId:string):string //done 
{
        const roomName = [myId,friend.id].sort().join('_');
        const unreadMsg:number = waitingMsg.filter(m=> m.room === roomName).length
        let status:string;
        if(friend.recv==myId && friend.msg_status && friend.msg_status === 'waiting')//TODO add this object status
            status = 'recv'
        else if(friend.recv==myId && friend.msg_status && friend.msg_status === 'send')
            status = 'seen'
        else
            status = 'send'

        return `<div id='msg-zone' data-id="${friend.id}" class="flex justify-center py-4 px-2 hover:bg-[#222222] transition-colors duration-300 sm:py-4 sm:px-4 md:py-5">
                    <div  class=" friend-msg-zone flex w-[95%] hover:cursor-pointer" data-id="${friend.id}" data-name = "${friend.username}" data-roomname = "${roomName}"  >
                        <div class=" w-10 h-10 
                                
                                md:w-12 md:h-12
                                bg-cover bg-center rounded-full" 
                            style="
                                background-image : url('http://localhost:8080/uploads/${friend.avatar_url}');
                                aspect-ratio: 1/1;
                            ">
                        </div>
                    <div class="ml-3 sm:ml-4 w-full flex flex-col justify-center">
                        <div class="flex justify-between">
                            <span class="font-semibold text-[#F5F5F5] text-sm sm:text-base md:text-lg">${friend.username}</span>
                            <span>${unreadMsgNumber(unreadMsg,friend.id)}</span>
                        </div>
                        <div class="flex justify-between items-center ">
                            <div id='container-of-last-msg-of-${friend.id}'
                                class="text-xs sm:text-sm md:text-base text-gray-300">
                                ${lastMsg(status,friend.msg,friend.id)} 
                            </div>
                            <span id='time-of-msg-${friend.id}' class="text-[10px] sm:text-xs md:text-sm text-[#888]">${ msgTime(friend.display_time)}</span>
                        </div>
                        </div>
                    </div>
                </div>`
}


export function listOfMsg(friends:any,waitingMsg:object,myId:string): string //done
{
    // console.log(friends);
    if(!friends || friends.length === 0)
    {
        return `<div class="flex flex-col items-center justify-center h-full text-center gap-4 px-6">

                        
                        <div class="border-1 rounded-full h-17 w-17 flex justify-center items-center">
                            <span class="material-symbols-outlined ">chat_add_on</span>
                        </div>

                        
                        <h1 class="text-2xl font-bold text-[#F5F5F5]">
                            No chats yet
                        </h1>

                        
                        <p class="text-[#888] max-w-sm leading-relaxed">
                            You don’t have any conversations yet.  
                            Add friends to start chatting and stay connected.
                        </p>

</div>
`
    }
    const friendCards = friends.map(element => friendCart(element,waitingMsg,myId)).join('\n')
    return `
            <style>
                #list-of-msg::-webkit-scrollbar {
                    width: 2px;
                }
                #list-of-msg::-webkit-scrollbar-thumb {
                    background-color: #E63946;
                    border-radius: 10px;
                }
                #list-of-msg::-webkit-scrollbar-track {
                    background-color: #181818;
                }
            </style>
        <div id="list-of-msg-container" class="w-full md:w-[27%]  md:min-w-[270px] h-full md:block block rounded-2xl bg-[#181818] shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A]  overflow-hidden" >
            <div class="sticky top-0 z-10 bg-[#181818] p-6">
                <h1 class="font-bold text-[#F5F5F5]">chat</h1>
            </div>
            <div class="h-full overflow-y-auto" id="list-of-msg">
                ${friendCards}
            </div>
        </div>`;
}

export function generateBlockButton(status:string):string
{
    if(status === 'accepted'){
        return `<div id="block-button" class="block-button-class flex items-center justify-center w-[70%] rounded-xl  bg-[#E63946] mb-5 hover:cursor-pointer">
                        <p class="block-button-class">Block</p>
                        <span class="block-button-class material-symbols-outlined">block</span>
                    </div>`
    }else{
        return `<div id="unblock-button" class="unblock-button-class flex items-center justify-center w-[70%] rounded-xl  bg-[#E63946] mb-5 hover:cursor-pointer">
                        <p class="unblock-button-class">unblock</p>
                        <span class="unblock-button-class material-symbols-outlined">lock_open_right</span>
                    </div>`
    }

}
/* ****************************************************************************************************************************************************************** */
export function profileNav(img:string,userAccount:string,status:string):string{
    return`
        <div id="profile-nav" class="flex h-[10%] items-center p-5 justify-between relative ">
            <div class="flex items-center gap-6">
                <div id="back-btn" class="flex justify-center items-center md:hidden p-2 text-[#E63946]   hover:cursor-pointer hover:bg-[#222222]  rounded-full">
                    <span class="material-symbols-outlined ">arrow_back_ios</span>
                </div>

                <div class="h-10 w-10  bg-cover bg-center rounded-full" 
                    style="
                        background-image : url('http://localhost:8080/uploads/${img}');
                        aspect-ratio: 1/1;
                    ">
                </div>
                <span class='font-semibold text-[#F5F5F5]'>${userAccount}</span>
            </div>

            <span id="more_vert" class="material-symbols-outlined text-[#E63946]  hover:cursor-pointer hover:bg-[#222222]  rounded-xl ">more_vert</span>

            <div id="popup-option" class="hidden text-white flex flex-col items-center  w-50 bg-[#181818] absolute right-6 top-12 rounded-xl border border-[#E63946] shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <div id="challenge-option" class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                    <p>Challenge</p>
                    <span class="material-symbols-outlined">swords</span>
                </div>
            </div>

            <div id="block-option" class="hidden text-white text-sm flex flex-col items-center  w-50 bg-[#181818] absolute right-6 top-12 rounded-xl border border-[#E63946] shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <p class="p-4" >If this account is blocked, you will not be able to send or receive messages from it</p>
                <div class="flex items-center w-full justify-around mb-2">
                    <button id="blocked-valid" class="rounded-xl bg-[#E63946] w-[40%]">Yes</button>
                    <button id="blocked-unvalid" class="rounded-xl border border-[#E63946] w-[40%]" >No</button>
                </div>
            </div>
            <div id="unblock-option" class="hidden text-white text-sm flex flex-col items-center  w-50 bg-[#181818] absolute right-6 top-12 rounded-xl border border-[#E63946] shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <p class="p-4" >Are you sure you want to unblock this account?</p>
                <div class="flex items-center w-full justify-around mb-2">
                    <button id="unblocked-valid" class="rounded-xl bg-[#E63946] w-[40%]">Yes</button>
                    <button id="unblocked-unvalid" class="rounded-xl border border-[#E63946] w-[40%]" >No</button>
                </div>
            </div>
            
        </div>
        <div class="h-[2px] bg-gradient-to-r from-[#E63946] to-[#8A1C1C]"></div>`
}
export function inputMsg(status:string):string //done
{
    if(status === 'blocked'){
        return `<div class="h-[100%] flex items-center justify-center mt-2">
                    <p class="text-[#E63946]">Contacting this account requires unblocking</p>
                </div>`
    }
    else{//TODO N9ra 3la ay l3ayba  dyal css
        return `
                <style>
                    #input-msg-zone {
                        overflow-y: hidden;
                    }
                    #input-msg-zone::-webkit-scrollbar {
                        display: none;
                    }
                </style>


                <div class="h-full border-[#E63946] rounded-xl border-2 flex items-center mt-2">
                    <textarea
                        id="input-msg-zone"
                        placeholder="Message..."
                        autofocus
                        class="h-[100%] w-[95%] text-[#F5F5F5] p-5 focus:outline-none resize-none"
                    ></textarea>
                    <button id="send-button"
                        class="bg-gradient-to-br from-[#E63946] to-[#8A1C1C] hover:from-[#FF4D4D]
                        hover:to-[#A02020] rounded-xl w-[8vw] md:w-[3vw] h-[80%] mr-2 ml-4 flex justify-center items-center">
                        <span class="material-symbols-outlined text-white">send</span>
                    </button>
                </div>`
    }
}
function escapeHTML(str: string): string {
    return str.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
}

export function sendMsg(msg:string,time:string,img:string):string{
    return `<div id="received-msg" class="flex mt-5  md:w-[30vw] w-[60vw]  justify-end ml-auto pr-5 ">
    <div id="content-received" class="flex flex-col ">
        <div class=" bg-[#E63946] rounded-xl p-3 ">
        <span class="text-[#F5F5F5]  break-all">
            ${escapeHTML(msg)}
        </span>
        </div> 
        <span id="text-received-time " class="text-xs text-[#888] mt-1 self-end">${time}</span>
    </div>
    </div>`
    // <img src="${img}" alt="" class="h-10 w-10 rounded-full mt-2 ml-2">
            
}


export function receivedMsg(msg:string,time:string,img:string):string{

    return `<div id="sent-msg" class="flex mt-5 md:w-[30vw] w-[80vw]  justify-start pl-5 ">
                <img src='http://localhost:8080/uploads/${img}' alt="" class="h-10 w-10 rounded-full mt-2 mr-2">
                <div id="content-sent" class="max-w-[80%] flex flex-col">
                    <div  class="border-2 border-[#E63946] rounded-xl p-3  ">
                        <span class="text-[#F5F5F5]  break-all">
                            ${escapeHTML(msg)}
                        </span>
                    </div>
                <span id="text-sent-time " class="text-xs text-[#888] mt-1">${time}</span>
                </div>
            </div>`
}


export function choseFriend():string{
    return `
    <div class="  text-[#F5F5F5] flex flex-col justify-center items-center  h-[100%]">
        <div class="border-1 rounded-full h-15 w-15 flex justify-center items-center">
            <span class="material-symbols-outlined ">chat_add_on</span>
        </div>
        <h1 class="text-[#F5F5F5] text-xl">Your chat</h1>
        <h2 class="text-[#888]">Choose a friend to start chat</h2>
    </div>`
}

export function chatZones():string{
    return`
    <style>
        #chat-zone {
        scrollbar-width: none;
        -ms-overflow-style: none; 
        }
        #chat-zone::-webkit-scrollbar {
        display: none;
        }
    </style>
    
    <div id="chat-zone" class="flex flex-col h-[100%] overflow-y-auto ">
    </div>
    <div id="x" class=" h-15">
    </div>`
}

export function DM():string{
    return`
            <div id="DM" class="hidden  h-full w-full flex  rounded-2xl p-4 md:flex flex-col bg-[#181818] shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A] " data-roomname="">
            ${choseFriend()}
            </div>`;
}

