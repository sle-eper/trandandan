
export function findingSpy(): string
{
    return `
        <div id="new-game-msg" class=" flex flex-col items-center justify-center gap-6 py-10">

            <div class="text-2xl font-bold text-[#ff4d4d] font-['Share_Tech_Mono'] 
                        tracking-wide text-center">
                After finding the spy, you can start a new game.
            </div>

            <button id="new-game"
                class="px-8 py-3 text-xl font-bold rounded-lg 
                    bg-[#ff4d4d] text-white shadow-lg
                    hover:bg-[#e63939] hover:scale-105 
                    transition-all duration-200 cursor-pointer
                    font-['Share_Tech_Mono'] tracking-wider">
                NEW GAME
            </button>
        </div>
    `;
}

// function shuffle(array:any[]) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
//     return array;
// }


// export function findingSpy(players:any[]):string
// {
//     const queue = shuffle([...players]); // نخلط اللاعبين ونعمل نسخة
//     const first = queue[0];

//     return `
//         <div id="spy-controller" 
//              class="flex flex-col items-center justify-center gap-8">

//             <div id="current-player"
//                  class="text-center text-red-500 font-mono text-3xl font-bold 
//                         border-[#E63946] rounded-xl border-2 px-8 py-6">
//                 ${first.name}
//             </div>

//             <button id="next-controller"
//                 class="px-8 py-3 text-xl font-bold rounded-lg 
//                     bg-[#ff4d4d] text-white shadow-lg
//                     hover:bg-[#e63939] hover:scale-105 
//                     transition-all duration-200 cursor-pointer">
//                 NEXT
//             </button>

//         </div>

//         <script>
//             let controllerQueue = ${JSON.stringify(queue)};
//             let index = 0;

//             document.getElementById("next-controller").onclick = () => {
//                 index++;

//                 if (index >= controllerQueue.length) {
//                     document.getElementById("spy-controller").innerHTML =
//                         "<div class='text-green-400 text-3xl font-bold'>✔ All players have taken their turn!</div>";
//                     return;
//                 }

//                 document.getElementById("current-player").innerText =
//                     controllerQueuindexe[index].name;
//             };
//         </script>
//     `;
// }
