
import spays from "../img/spays.png"
import players from "../img/players.png"
import sections from "../img/sections.png"


export function handelNum(target:string,max:number)
{
    const spaysInput = document.getElementById(target) as HTMLLIElement ;
    if(spaysInput)
    {
        spaysInput.addEventListener('keyup',()=>{//TODO handel >10 and <1
            const value:number =  spaysInput.value;
            if(value >  max )
                spaysInput.value = max;
            // else if(value == 0)
            //     spaysInput.value = 1;
        })
    }
}

function card(img:string, defaultSpiesCount: number,id:string):string
{
    const hideSpinnersStyle = `style="-moz-appearance: textfield;"`
    return `
            <div class = " relative w-full max-w-[350px] group  cursor-pointer transition-transform duration-200 
                        hover:scale-105" >
                <img src="${img}" alt="Spy Config Card" class="w-full h-auto object-contain ">
                <div class="absolute bottom-[28%] left-0 right-0 flex justify-center items-center z-10">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value="${defaultSpiesCount}"
                        ${hideSpinnersStyle}
                        class="w-1/3 bg-transparent text-center text-red-500 font-mono text-5xl font-bold border-none focus:ring-0 focus:outline-none "
                        id= "${id}"
                    />
                </div>
            </div>
    `
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
        <div class ="grid grid-cols-3 gap-4 justify-items-center items-center  w-full h-full border">
            ${card(players,7,"playersInput")}
            ${card(spays,1,"spaysInput")}
            ${card(sections,1,"spaysInput")}
            <div id="next" class="flex justify-center items-center w-[30%] p-3 col-span-3 border-2 border-[#E63946] text-[#E63946] text-xl  rounded-xl hover:scale-105 transition-transform duration-200 cursor-pointer hover:bg-[#E63946] hover:text-black">
                NEXT
            </div>
        </div>
    `

}