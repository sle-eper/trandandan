
export function findingSpy(msg:string): string
{
    const isSpyWon = msg.toLowerCase().includes("spy won");
    const color = isSpyWon ? "#22c55e" : "#ef4444";
    return `
        <div id="new-game-msg" class=" flex flex-col items-center justify-center gap-6 py-10">

            <div class="text-2xl font-bold text-[${color}] font-['Share_Tech_Mono'] 
                        tracking-wide text-center">
                ${msg}, you can start a new game.
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
