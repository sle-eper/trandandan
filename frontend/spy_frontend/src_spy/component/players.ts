

export function renderPlayers(data,userName:string):string
{
    let content:string ='<div class = "flex flex-col items-center justify-center  overflow-y-auto  gap-5">';
    const hideSpinnersStyle = `style="-moz-appearance: textfield;"`
    for(let i:number = 0;i < data.players ;i++)
    {
        content += `
                <div class="flex justify-center items-center border-[#E63946] rounded-xl border-2">
                    <input
                        ${hideSpinnersStyle}
                        value = "${i=== 0 ? userName:`player ${i+1}`}"
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
