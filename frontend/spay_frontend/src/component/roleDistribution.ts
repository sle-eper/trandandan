
import normalPlayer from '../img/normalPlayer.png' 
import spayCard from '../img/spayCard.png' 


function rand(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function roleDistribution(playersData:any,numberOfPlayer:number,spays:number)
{
    const spaysId:number[] = []
    while(spaysId.length < spays)
    {
        let id = rand(1,numberOfPlayer)
        if(!spaysId.includes(id))
            spaysId.push(id)
    }
    const game = playersData.map(p=>{
        if(spaysId.includes(p.id))
        {
            p.spay = true
            p.card = `<div class = "card  cursor-pointer transition-transform duration-200 
                        hover:scale-105" >
                        <img src="${spayCard}" alt="Spy Config Card" class="w-full h-auto object-contain ">
                    </div>`
        }else{
            p.card = `<div class = "card cursor-pointer transition-transform duration-200 
                        hover:scale-105" >
                        <img src="${normalPlayer}" alt="Spy Config Card" class="w-full h-auto object-contain ">
                    </div>`
        }
        return p
    })
    // console.log(typeof(game))
    return game
    return `
            <div class = "cursor-pointer transition-transform duration-200 
                        hover:scale-105" >
                <img src="${normalPlayer}" alt="Spy Config Card" class="w-full h-auto object-contain ">
            </div>
    `
}