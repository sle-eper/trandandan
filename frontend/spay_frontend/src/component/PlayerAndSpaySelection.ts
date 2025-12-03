import counter from '../img/counter.png'

export function PlayerAndSpaySelection(title:string,counter?:number) {
    return `
    <div id="counter-${title}" class="hidden flex flex-col items-center justify-center gap-6">

        <!-- Counter Box -->
        <div class="text-4xl font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000] select-none">${title}</div>
        <div class="flex items-center justify-center gap-3 
                    border-2 border-[#ff4d4d] rounded-xl px-4 py-2
                    bg-[#1a1a1a]  ">
            <!-- Minus Button -->
            <button 
                id="counter-decrease-${title}"
                class="px-5 py-2 text-xl font-bold rounded-lg
                    bg-[#ff4d4d] text-white 
                    hover:bg-[#e63939] hover:scale-105
                    transition-all duration-200 cursor-pointer
                    font-['Share_Tech_Mono'] select-none">
                -
            </button>

            <!-- Number Display -->
            <div id="counter-value-${title}"
                class="text-2xl font-bold text-white w-10 text-center
                font-['Share_Tech_Mono'] select-none">
                ${counter}
            </div>

            <!-- Plus Button -->
            <button 
                id="counter-increase-${title}"
                class="px-5 py-2 text-xl font-bold rounded-lg
                    bg-[#ff4d4d] text-white 
                    hover:bg-[#e63939] hover:scale-105
                    transition-all duration-200 cursor-pointer
                    font-['Share_Tech_Mono'] select-none">
                +
            </button>
        </div>
        <button id="confirm-${title}"
                class="px-10 py-4 text-xl font-bold rounded-lg 
                    bg-[#ff4d4d] text-white shadow-lg
                    hover:bg-[#e63939] hover:scale-105 
                    transition-all duration-200 cursor-pointer
                    font-['Share_Tech_Mono'] tracking-wider select-none">
            CONFIRM
        </button>
    </div>
    `;
}
