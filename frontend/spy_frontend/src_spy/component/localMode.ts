
import spays from "../img/spays.png"
import players from "../img/players.png"
import sections from "../img/sections.png"
import history from "../img/history.png"

export function displayCard(index:number)
{
    console.log(index)
    const players = document.getElementById('playersCard-container');
    const spyNumber = document.getElementById('spaysCard-container');
    const sections = document.getElementById('sectionsCard-container');
    const history = document.getElementById('historyCard-container');
    if(index === 0)
    {
        if(players?.classList.contains('hidden'))
        {
            players.classList.remove('hidden');
            players.classList.remove('mobile-hidden');
        }
        if(!spyNumber?.classList.contains('hidden'))
        {
            spyNumber?.classList.add('hidden')
            spyNumber?.classList.add('mobile-hidden');
        }
        if(!sections?.classList.contains('hidden'))
        {
            sections?.classList.add('hidden')
            sections?.classList.add('mobile-hidden')
        }
        if(!history?.classList.contains('hidden'))
        {
            history?.classList.add('hidden')
            history?.classList.add('mobile-hidden')
        }
    }else if(index === 1)
    {
        if(spyNumber?.classList.contains('hidden'))
        {
            spyNumber.classList.remove('hidden');
            spyNumber.classList.remove('mobile-hidden');
        }
        if(!players?.classList.contains('hidden'))
        {
            players?.classList.add('hidden')
            players?.classList.add('mobile-hidden')
            
        }
        if(!sections?.classList.contains('hidden'))
        {
            sections?.classList.add('hidden')
            sections?.classList.add('mobile-hidden')
        }
        if(!history?.classList.contains('hidden'))
        {
            history?.classList.add('hidden')
            history?.classList.add('mobile-hidden')
        }
    }else if (index === 2)
    {
        if(sections?.classList.contains('hidden'))
        {
            sections.classList.remove('hidden');
            sections.classList.remove('mobile-hidden');
        }
        if(!spyNumber?.classList.contains('hidden'))
        {
            spyNumber?.classList.add('hidden')
            spyNumber?.classList.add('mobile-hidden')
        }
        if(!players?.classList.contains('hidden'))
        {
            players?.classList.add('hidden')
            players?.classList.add('mobile-hidden')
        }
        if(!history?.classList.contains('hidden'))
        {
            history?.classList.add('hidden')
            history?.classList.add('mobile-hidden')
        }
    }else if(index === 3)
    {
        if(history?.classList.contains('hidden'))
        {
            history.classList.remove('hidden');
            history.classList.remove('mobile-hidden');
        }
        if(!spyNumber?.classList.contains('hidden'))
        {
            spyNumber?.classList.add('hidden')
            spyNumber?.classList.add('mobile-hidden')
        }
        if(!players?.classList.contains('hidden'))
        {
            players?.classList.add('hidden')
            players?.classList.add('mobile-hidden')
        }
        if(!sections?.classList.contains('hidden'))
        {
            sections?.classList.add('hidden')
            sections?.classList.add('mobile-hidden')
        }
    }
}


function card(img: string, id: string, globalId: string, defaultSpiesCount?: number): string {
        let visible:string = globalId === 'spaysCard' || globalId === 'sectionsCard' || globalId === 'historyCard'?'hidden mobile-hidden':''
        const counter:string = defaultSpiesCount ? `<div id="${id}" class="absolute bottom-[29%] left-0 right-0 flex justify-center items-center z-10
                text-2xl font-bold text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
                    ${defaultSpiesCount}
            </div>`:``

        return `
        <style>
            @media (max-width: 1340px) {
                .mobile-hidden {
                    display: none;
                }
            }

            @media (min-width: 1339px) {
                .mobile-hidden {
                    display: block;
                }
            }
        </style>
        <div id="${globalId}-container" class=" ${visible} relative w-[68vw] max-w-[300px]   group cursor-pointer transition-transform duration-200 hover:scale-105">
            <img id="${globalId}" src="${img}" alt="Spy Config Card" class="w-full object-contain">
            ${counter}
        </div>
    `;
}

export function renderLocalMode(player?:number,spy?:number,section?:number):string
{
    
        return `
        <style>
            @media (max-width: 1340px) {
                .btn-hidden {
                    display: block;
                }
            }

            @media (min-width: 1339px) {
                .btn-hidden {
                    display: none;

                }
            }
        </style>
        <div id="local-mode"
            class="relative  h-full flex flex-col justify-center items-center gap-8">
            <div class="w-full flex justify-center items-center">
                <div id="back-btn" class="btn-hidden flex justify-center items-center  p-2 text-[#E63946]   hover:cursor-pointer hover:bg-[#222222]  rounded-full select-none">
                    <span id="back-btn-logo" class="material-symbols-outlined select-none">arrow_back_ios</span>
                </div>
                ${card(players,"playersInput","playersCard",player || 3)}
                ${card(spays,"spaysInput","spaysCard",spy || 1,)}
                ${card(sections,"sectionInput","sectionsCard",section || 1)}
                ${card(history,"historyInput","historyCard")}
                <div id="next-btn" class="btn-hidden flex justify-center items-center  p-2 text-[#E63946]   hover:cursor-pointer hover:bg-[#222222]  rounded-full select-none">
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