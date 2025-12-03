
import spays from "../img/spays.png"
import players from "../img/players.png"
import sections from "../img/sections.png"



function card(img: string, defaultSpiesCount: number, id: string, globalId: string): string {
    return `
        <div id="${globalId}" class="relative w-full max-w-[350px] group cursor-pointer transition-transform duration-200 hover:scale-105">
            <img src="${img}" alt="Spy Config Card" class="w-full h-auto object-contain">
            
            <div id="${id}" class="absolute bottom-[29%] left-0 right-0 flex justify-center items-center z-10
                text-4xl font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
                    ${defaultSpiesCount}
            </div>
        </div>
    `;
}

export function renderLocalMode():string
{
    
    
    return `
        <style>
            input[type=number]::-webkit-outer-spin-button,
            input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }
            input[type=number] {
            -moz-appearance: textfield;
            }
        </style>
        <div id="local-mode" class ="grid grid-cols-3 gap-4 justify-items-center items-center  w-full h-full border">
            ${card(players,7,"playersInput","playersCard")}
            ${card(spays,1,"spaysInput","spaysCard")}
            ${card(sections,1,"sectionInput","sectionsCard")}
            <div class="col-span-3 w-full flex justify-center">
                <button id="next"
                        class="px-10 py-4 text-xl font-bold rounded-lg 
                            bg-[#ff4d4d] text-white shadow-lg
                            hover:bg-[#e63939] hover:scale-105 
                            transition-all duration-200 cursor-pointer
                            font-['Share_Tech_Mono'] tracking-wider">
                    NEXT
                </button>
            </div>
        </div>
    `

}