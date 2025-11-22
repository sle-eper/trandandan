
function profileNav():string{
    return`
        <div id="profile-nav" class="flex h-[10%] items-center p-5 justify-between">
            <div class="flex items-center gap-6">
              <img src="./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp" alt="" class="h-10 w-10 rounded-full ">
              <span class='font-semibold text-[#F5F5F5]'>hassan</span>
            </div>
            <span class="material-symbols-outlined text-[#E63946]">report</span>
          </div>
          <div class="h-[2px] bg-gradient-to-r from-[#E63946] to-[#8A1C1C]"></div>`
}

function inputMsg():string{
    return `<div id="input-msg" class="h-15 border-[#E63946] rounded-xl border-2 flex items-center mt-2">
            <input type="text" placeholder="Message..." id="input-msg-zone" class="h-[100%] w-[95%] text-[#F5F5F5] p-5 focus:outline-none">
            <button id="send-button" class="bg-gradient-to-br from-[#E63946] to-[#8A1C1C] hover:from-[#FF4D4D] hover:to-[#A02020] rounded-xl w-[5%] h-[80%] mr-2 ml-4 flex justify-center items-center">
              <span class="material-symbols-outlined text-white">send</span>
            </button>
          </div>`
}

export function sendMsg(msg:string):string{

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
              </div>
          `
}

// <div id="received-msg" class="flex mt-5 h-auto w-[65%]  justify-end ml-auto pr-5">
//   <div id="content-received" class="max-w-[80%] flex flex-col ">
//     <div id="text-received" class=" bg-[#E63946] rounded-xl p-3 ">
//       <span class="text-[#F5F5F5]">
//         Lorem ipsum dolor sit amet, consectetur adipisicing elit.
//       </span>
//     </div>
//     <span id="text-received-time " class="text-xs text-[#888] mt-1 self-end">1:16</span>
//   </div>
//   <img src="./src/img/smiling-african-american-millennial-businessman-600nw-1437938108.webp" alt="" class="h-10 w-10 rounded-full mt-2 ml-2">
// </div>

function chatZone():string{
    return`<div id="chat-zone" class="flex flex-col h-[100%] overflow-y-auto hide-scrollbar">
          </div>`
}
export function DM():string{
    return`
    <div id="DM" class="w-[55%] h-[90%] rounded-2xl p-4 flex flex-col bg-[#181818] shadow-[0_0_25px_rgba(0,0,0,0.6)] border border-[#2A2A2A]">
        ${profileNav()}
        ${chatZone()}
        ${inputMsg()}
    </div>
            `;
}