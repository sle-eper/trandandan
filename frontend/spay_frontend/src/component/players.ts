// import playerBored from "../img/playerBored.png"

// interface data  {
//             players:number,
//             spays:number
//         }

export function renderPlayers(data):string
{
    let content:string ='<div class = "flex flex-col items-center justify-center  overflow-y-auto  gap-5">';
    const hideSpinnersStyle = `style="-moz-appearance: textfield;"`
    for(let i:number = 0;i < data.players ;i++)
    {
        content += `
                <div class="bottom-[37%] left-0 right-0 flex justify-center items-center z-10  border-[#E63946] rounded-xl border-2">
                    <input
                        ${hideSpinnersStyle}
                        value = "player ${i+1}"
                        id="player-${i+1}"
                        class="w-[90%] bg-transparent text-center text-red-500 font-mono text-xl font-bold border-none focus:ring-0 focus:outline-none "
                    />
                </div>
        `
    }

    content += `<div id="play" class="flex justify-center items-center w-[30%] border-2 border-[#E63946] text-[#E63946] text-xl rounded-xl cursor-pointer  hover:bg-[#E63946] hover:text-black">
                    PLAY 
                </div>`
    content += '</div>'
    return content
}