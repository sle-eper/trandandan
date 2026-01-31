
import normalPlayer from '../img/normalPlayer.png?inline' 
import spayCard from '../img/spayCard.png?inline' 
import backCard from "../img/backCard.png?inline"
import spaySections from "../sectionsData/sectionsData"
import { setCorrectChoice } from "../app";




function rand(min:number, max:number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function renderBackCard():string
{
    return `
        <div class = "card cursor-pointer transition-transform duration-200 
                        hover:scale-105" >
                        <img src="${backCard}" alt="Spy Config Card" class="w-full h-auto object-contain ">
                    </div>
    `
}

function winningWord(selected):object
{

    const idSection =  selected[rand(0,selected.length - 1)]
    const section =  spaySections.find((s)=>{
        return s.id == idSection
    })
    const itemsOfSection = section?.items || '';
    const index:number = rand(0,itemsOfSection?.length - 1)
    setCorrectChoice(itemsOfSection[index].name)
    return({name:itemsOfSection[index].name,img:itemsOfSection[index].imageUrl})
}

export function roleDistribution(playersData:any,numberOfPlayer:number,spays:number,selected)
{
    const spaysId:number[] = []
    const winItem = winningWord(selected);
    //kankhetar id dyal spay 
    while(spaysId.length < spays)
    {
        let id = rand(1,numberOfPlayer)
        if(!spaysId.includes(id))
            spaysId.push(id)
    }

    const game = playersData.map( p =>{
        if(spaysId.includes(p.id))
        {
            p.spay = true
            p.card = `
                    <div class = "card  cursor-pointer transition-transform duration-200 
                        hover:scale-105" >
                        <img src="${spayCard}" alt="Spy Config Card" class="w-full h-auto object-contain ">
                    </div>`
        }else{
            p.card = `<div class="relative card cursor-pointer transition-transform duration-200 hover:scale-105 w-fit">
    
    <!-- Background image -->
    <img
        src="${normalPlayer}"
        alt="Spy Config Card"
        class="w-full h-auto object-contain"
    />

    <!-- Box that contains the second image -->
    <div class="absolute  top-18 left-0 right-0     flex items-center justify-center">
        <div class="bg-black/40 p-2  border-2 border-red-400 rounded-xl">
            <img
                src="${winItem.img}"
                alt=""
                class="h-[30vw] w-[34vw] md:h-46 md:w-61 rounded-lg object-cover"
            />
        </div>
    </div>

    <!-- Text -->
    <div
        class="absolute bottom-[25%] left-0 right-0 flex justify-center items-center z-10
        text-2xl font-bold uppercase text-[#ff4d4d] tracking-wide
        font-['Share_Tech_Mono']
        [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]"
    >
        ${winItem.name}
    </div>
</div>
`
        }
        return p
    })
    return game
}