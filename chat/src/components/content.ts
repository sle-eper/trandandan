



function friendCart(friend:{id:string,name: string; img: string}):string //done 
{
    // console.log(friend.id);
    return `<div id="msg-zone" class="flex justify-center  p-5 hover:bg-[#222222] transition-colors duration-300"">
                <div  class=" friend-msg-zone flex w-[95%] hover:cursor-pointer" data-id="${friend.id}" data-name = "${friend.name}"  >
                    <div id="" class=" w-13 h-13  bg-cover bg-center rounded-full" 
                        style="
                            background-image : url('${friend.img}');
                            aspect-ratio: 1/1;
                        ">
                    </div>
                <div class="ml-4 w-full flex flex-col justify-center">
                    <span class="font-semibold text-[#F5F5F5]">${friend.name}</span>
                    <div class="flex justify-between items-center ">
                        <span class=" font-thin flex-grow  truncate  text-[#888]" >ah mtafe9 m3ak</span>
                        <span class="text-sm text-[#888] text-right "> 1:13 </span>
                    </div>
                    </div>
                </div>
            </div>`
}


export function listOfMsg(friends: {id:string;name: string;  img: string}[]): string //done
{
    const friendCards = friends.map(element => friendCart(element)).join('\n')
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
        <div class="w-[25%] h-[90%] rounded-2xl bg-[#181818] shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A]  overflow-hidden" >
            <div class="sticky top-0 z-10 bg-[#181818] p-6">
                <h1 class="font-bold text-[#F5F5F5]">chat</h1>
            </div>
            <div class="h-full overflow-y-auto" id="list-of-msg">
                ${friendCards}
            </div>
        </div>`;
}

export function generateBlockButton(statis:string):string
{
    if(statis === 'accepted'){
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
                <div class="h-10 w-10  bg-cover bg-center rounded-full" 
                    style="
                        background-image : url('${img}');
                        aspect-ratio: 1/1;
                    ">
                </div>
                <span class='font-semibold text-[#F5F5F5]'>${userAccount}</span>
            </div>

            <span id="more_vert" class="material-symbols-outlined text-[#E63946]  hover:cursor-pointer hover:bg-[#222222]  rounded-xl ">more_vert</span>

            <div id="popup-option" class="hidden text-white flex flex-col items-center  w-50 bg-[#181818] absolute right-6 top-12 rounded-xl border border-[#E63946] shadow-[0_0_25px_rgba(0,0,0,0.6)]">
                <div class="flex items-center justify-center w-[70%] rounded-xl border border-[#E63946] mt-5 mb-2 hover:cursor-pointer">
                    <p>Challenge</p>
                    <span class="material-symbols-outlined">swords</span>
                </div>
                ${generateBlockButton(status)}
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
    else{
        
        return `
                <div class="h-[100%] border-[#E63946] rounded-xl border-2 flex items-center mt-2">
                    <input type="text" placeholder="Message..." id="input-msg-zone" class="h-[100%] w-[95%] text-[#F5F5F5] p-5 focus:outline-none">
                    <button id="send-button" class="bg-gradient-to-br from-[#E63946] to-[#8A1C1C] hover:from-[#FF4D4D] hover:to-[#A02020] rounded-xl w-[5%] h-[80%] mr-2 ml-4 flex justify-center items-center">
                        <span class="material-symbols-outlined text-white">send</span>
                    </button>
                </div>`
    }
}
export function sendMsg(msg:string):string{
    return `<div id="received-msg" class="flex mt-5 h-auto w-[65%]  justify-end ml-auto pr-5 ">
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


export function receivedMsg(msg:string):string{

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
    
    <div id="chat-zone" class="flex flex-col h-[100%] overflow-y-auto">
    </div>
    <div id="x" class=" h-15">
    </div>`
}

export function DM():string{
    return`
            <div id="DM" class="w-[55%] h-[90%] rounded-2xl p-4 flex flex-col bg-[#181818] shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A]">
            ${choseFriend()}
            </div>`;
}