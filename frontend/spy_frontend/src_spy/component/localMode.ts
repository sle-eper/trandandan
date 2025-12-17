
import spays from "../img/spays.png"
import players from "../img/players.png"
import sections from "../img/sections.png"

export function displayCard(index:number)
{
    const players = document.getElementById('playersCard-container');
    const spyNumber = document.getElementById('spaysCard-container');
    const sections = document.getElementById('sectionsCard-container');
    if(index === 0)
    {
        if(players?.classList.contains('hidden'))
            players.classList.remove('hidden');
        if(!spyNumber?.classList.contains('hidden'))
            spyNumber?.classList.add('hidden')
        if(!sections?.classList.contains('hidden'))
            sections?.classList.add('hidden')
    }else if(index === 1)
    {
        if(spyNumber?.classList.contains('hidden'))
            spyNumber.classList.remove('hidden');
        if(!players?.classList.contains('hidden'))
            players?.classList.add('hidden')
        if(!sections?.classList.contains('hidden'))
            sections?.classList.add('hidden')
    }else if (index === 2)
    {
        if(sections?.classList.contains('hidden'))
            sections.classList.remove('hidden');
        if(!spyNumber?.classList.contains('hidden'))
            spyNumber?.classList.add('hidden')
        if(!players?.classList.contains('hidden'))
            players?.classList.add('hidden')
    }
}


function card(img: string, defaultSpiesCount: number, id: string, globalId: string): string {
    let visible:string = globalId === 'spaysCard' || globalId === 'sectionsCard'?'hidden':''
    // return `
    //     <div  class=" border relative h-full w-full max-w-[350px] group cursor-pointer transition-transform duration-200 hover:scale-105">
    //         <img id="${globalId}" src="${img}" alt="Spy Config Card" class="w-full h-auto object-contain">
            
    //         <div id="${id}" class="absolute bottom-[29%] left-0 right-0 flex justify-center items-center z-10
    //             text-4xl font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
    //             [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
    //                 ${defaultSpiesCount}
    //         </div>
    //     </div>
    // `;

        return `
        <div id="${globalId}-container" class=" ${visible} relative w-[68vw] max-w-[300px]   group cursor-pointer transition-transform duration-200 hover:scale-105">
            <img id="${globalId}" src="${img}" alt="Spy Config Card" class="w-full object-contain">
            
            <div id="${id}" class="absolute bottom-[29%] left-0 right-0 flex justify-center items-center z-10
                text-2xl font-bold text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
                    ${defaultSpiesCount}
            </div>
        </div>
    `;
}

export function renderLocalMode(player?:number,spy?:number,section?:number):string
{
    
    
    // return `
    //     <style>
    //         input[type=number]::-webkit-outer-spin-button,
    //         input[type=number]::-webkit-inner-spin-button {
    //         -webkit-appearance: none;
    //         margin: 0;
    //         }
    //         input[type=number] {
    //         -moz-appearance: textfield;
    //         }
    //     </style>
        
    //     <div id="local-mode"
    //         class="relative border h-full flex flex-col justify-center items-center overflow-hidden">
    //         <div id="cards-wrapper" class=" w-[700px]  flex justify-center items-center overflow-hidden">


    //         <div class="scale-90 opacity-70 transition-all duration-300  -translate-x-24">
    //             ${card(players,3,"playersInput","playersCard")}
    //         </div>

    //         <!-- center card (ACTIVE) -->
    //         <div class="scale-110 transition-all duration-300 z-10 ">
    //             ${card(spays,1,"spaysInput","spaysCard")}
    //         </div>

    //         <!-- right card -->
    //         <div class="scale-90 opacity-70 transition-all duration-300   translate-x-24 ">
    //             ${card(sections,1,"sectionInput","sectionsCard")}
    //         </div>
    //         </div>
    //         <div class="mt-20 w-full flex justify-center">
    //             <button id="next"
    //                     class="px-10 py-4 text-xl font-bold rounded-lg 
    //                         bg-[#ff4d4d] text-white shadow-lg
    //                         hover:bg-[#e63939] hover:scale-105 
    //                         transition-all duration-200 cursor-pointer
    //                         font-['Share_Tech_Mono'] tracking-wider">
    //                 NEXT
    //             </button>
    //         </div>
    //     </div>
    // `

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
        <div id="local-mode"
            class="relative  h-full flex flex-col justify-center items-center gap-8">
            <div class="w-full flex justify-center items-center">
                <div id="back-btn" class="flex justify-center items-center md:hidden p-2 text-[#E63946]   hover:cursor-pointer hover:bg-[#222222]  rounded-full select-none">
                    <span id="back-btn-logo" class="material-symbols-outlined select-none">arrow_back_ios</span>
                </div>
                ${card(players,player || 3,"playersInput","playersCard")}
                ${card(spays,spy || 1,"spaysInput","spaysCard")}
                ${card(sections,section || 1,"sectionInput","sectionsCard")}
                <div id="next-btn" class="flex justify-center items-center md:hidden p-2 text-[#E63946]   hover:cursor-pointer hover:bg-[#222222]  rounded-full select-none">
                    <span id="next-btn-logo" class="material-symbols-outlined select-none">arrow_forward_ios</span>
                </div>
            </div>
            <div class="w-full flex justify-center">
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