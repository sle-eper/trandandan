import {renderNavBar} from '../../auth_frontend/src_auth/dashboard/navbar'
import {renderSidebar} from '../../auth_frontend/src_auth/dashboard/sidebar'
import { renderGameMode } from './component/gameMode';
import { renderLocalMode } from './component/localMode';
import { renderPlayers } from './component/players';
import { roleDistribution } from './component/roleDistribution';
import { renderBackCard } from './component/roleDistribution';
import { renderSection,selectSection } from './component/sections';
import {PlayerAndSpaySelection} from "./component/PlayerAndSpaySelection.ts"

document.body.classList.remove("bg-black","flex", "items-center", "justify-center", "px-6", "md:px-20");
document.body.classList.add("bg-[#111]", "min-h-screen");

const app = document.getElementById("login-app");

if(app){
app.innerHTML = `
            <div id="nav-bar"></div>
            <div id="layout" class="flex flex-row" >
                <div id="side-bar" ></div>
                <div id="spay-content" class="flex justify-center items-center w-full"></div>
            </div>` 
}

const nav = document.getElementById("nav-bar");
const sidebar = document.getElementById("side-bar");

if (nav) nav.innerHTML = renderNavBar();
if (sidebar) sidebar.innerHTML = renderSidebar();
//start og game 
const main = document.getElementById("spay-content")
if(main)
{
    //show game mode
    main.innerHTML = renderGameMode()
    // main.innerHTML = PlayerAndSpaySelection()
    const localMode = document.getElementById("localMode")
    if(localMode)
    {
        const data = {
            players:0,
            spays:0,
        }
        // if chose local mode
        localMode.addEventListener('click',()=>{
            // game settings
            main.innerHTML = renderLocalMode() + renderSection() + PlayerAndSpaySelection("players",7) + PlayerAndSpaySelection("spays",1)
            ////////////////////////////////////
            const next = document.getElementById("next");
            const sectionCard = document.getElementById("sectionsCard");//card of sections
            const playersCard = document.getElementById("playersCard");//card of sections
            const spaysCard = document.getElementById("spaysCard");//card of sections
            if(spaysCard)
            {
                let spaysNumber:number;
                spaysCard.addEventListener("click",()=>{
                    document.getElementById("local-mode")?.classList.add('hidden')
                    document.getElementById("counter-spays")?.classList.remove('hidden')
                    const plus = document.getElementById("counter-increase-spays");
                    const minus = document.getElementById("counter-decrease-spays");
                    plus?.addEventListener("click",()=>{
                        const nbr = document.getElementById("counter-value-spays");
                        if(nbr)
                        {
                            let value = Number(nbr.innerText);
                            if(!isNaN(value))
                            {
                                
                                if(value < 3)
                                {
                                    value++
                                    spaysNumber = value
                                    nbr.innerHTML = String(value);
                                }
                            }
                        }
                    })
                    minus?.addEventListener("click",()=>{
                        const nbr = document.getElementById("counter-value-spays");
                        if(nbr)
                        {
                            let value = Number(nbr.innerText);
                            if(!isNaN(value))
                            {
                                if(value > 1)
                                {
                                    value--
                                    spaysNumber = value
                                    nbr.innerHTML = String(value);
                                }
                            }
                        }
                    })
                    const confirm = document.getElementById("confirm-spays")
                    confirm?.addEventListener("click",()=>{
                        if(spaysNumber > 0 && spaysNumber <= 3 )
                        {

                            document.getElementById("local-mode")?.classList.remove('hidden')
                            document.getElementById("counter-spays")?.classList.add('hidden')
                            const playerInput = document.getElementById("spaysInput");
                            if(playerInput) playerInput.innerHTML = String(spaysNumber)
                        }
                        
                    })
                })
            }
            if(playersCard)
            {
                let playerNumber:number;
                playersCard.addEventListener("click",()=>{
                    document.getElementById("local-mode")?.classList.add('hidden')
                    document.getElementById("counter-players")?.classList.remove('hidden')
                    const plus = document.getElementById("counter-increase-players");
                    const minus = document.getElementById("counter-decrease-players");
                    plus?.addEventListener("click",()=>{
                        const nbr = document.getElementById("counter-value-players");
                        if(nbr)
                        {
                            let value = Number(nbr.innerText);
                            if(!isNaN(value))
                            {
                                if(value < 10)
                                {
                                    value++
                                    playerNumber = value
                                    nbr.innerHTML = String(value);
                                }
                            }
                        }
                    })
                    minus?.addEventListener("click",()=>{
                        const nbr = document.getElementById("counter-value-players");
                        if(nbr)
                        {
                            let value = Number(nbr.innerText);
                            if(!isNaN(value))
                            {
                                if(value > 1)
                                {
                                    value--
                                    playerNumber = value
                                    nbr.innerHTML = String(value);
                                }
                            }
                        }
                    })
                    const confirm = document.getElementById("confirm-players")
                    confirm?.addEventListener("click",()=>{
                        if(playerNumber > 0 && playerNumber <= 10)
                        {
                            document.getElementById("local-mode")?.classList.remove('hidden')
                            document.getElementById("counter-players")?.classList.add('hidden')
                            const playerInput = document.getElementById("playersInput");
                            if(playerInput) playerInput.innerHTML = String(playerNumber)
                        }
                        
                    })
                })
            }
            if(sectionCard)
            {
                const selected: string[] = []
                selectSection(selected)//TODO 3lach hena khedama ola habetha ltahet la 

                sectionCard.addEventListener('click',()=>{
                    document.getElementById("local-mode")?.classList.add('hidden')
                    document.getElementById("sections-selection")?.classList.remove('hidden')
                    const confirmSections = document.getElementById("confirm-sections");
                    if(confirmSections)
                    {
                        confirmSections.addEventListener("click",()=>{
                            if(selected.length > 0)
                            {
                                document.getElementById("local-mode")?.classList.remove('hidden')
                                document.getElementById("sections-selection")?.classList.add('hidden')
                                const sectionInput = document.getElementById("sectionInput");
                                if(sectionInput) sectionInput.innerHTML = String(selected.length)
                            }
                        })
                    }
                })
            }
            if(next)
            {
                next.addEventListener('click',()=>{
                    function validNumberOfSpays(players:number,spays:number):boolean
                    {
                        return (spays < players) && (players - spays > spays) 
                    }
                    //////////////////////// set data of game ///////////////////////////////////////////////////
                    const playersInput:HTMLDivElement = document.getElementById("playersInput") as HTMLDivElement;
                    const spaysInput:HTMLDivElement = document.getElementById("spaysInput") as HTMLDivElement;
                    const numberOfPlayer = Number(playersInput.innerText)
                    const numberOfSpays = Number(spaysInput.innerText)
                    if(playersInput && numberOfPlayer > 0 && numberOfPlayer <= 10 )
                        data.players =  numberOfPlayer
                    if(spaysInput && validNumberOfSpays(numberOfPlayer,numberOfSpays))
                        data.spays = numberOfSpays
                    
                    //////////////////////////////////////////////////////////////////////////////////////////
                    console.log(data.spays,data.players);
                    if(data.spays && data.players)
                    {
                        console.log(data.spays,data.players)
                        main.innerHTML = renderPlayers(data) 
                    }

                    const play = document.getElementById("play");
                    if(play)
                    {
                        play.addEventListener('click',()=>{
                            function turnOver(spays)
                            {
                                const cardContainer = document.getElementById("cards-container");
                                const backCard = renderBackCard()
                                let index = 0;
                                const end = spays.length * 2;
                                if(cardContainer) 
                                {
                                    cardContainer.innerHTML = backCard
                                    cardContainer.addEventListener('click',()=>{
                                        if(index < end)
                                        {
                                            if(!(index % 2))
                                            {
                                                console.log(index)
                                                cardContainer.innerHTML = spays[index / 2].card
                                            }
                                            else
                                                cardContainer.innerHTML = backCard
                                        }
                                        index++
                                    })
                                }
                            }
                            const players = []
                            for(let i = 0 ; i < data.players ; i++)
                            {
                                let p:HTMLInputElement = document.getElementById(`player-${i+1}`) as HTMLInputElement
                                if(p)
                                    players.push({id:i+1,name:p.value,spay:false,card:''});
                            }
                            //kanfar9 3lihom roles 
                            const spays = roleDistribution(players,data.players,data.spays)
                            // carts kayt9elbo hena 
                            main.innerHTML = `<div id="cards-container"></div>`;
                            turnOver(spays)
                            // const cardContainer = document.getElementById("cards-container");
                            // const backCard = renderBackCard()
                            // let index = 0;
                            // const end = spays.length * 2;
                            // if(cardContainer) 
                            // {
                            //     cardContainer.innerHTML = backCard
                            //     cardContainer.addEventListener('click',()=>{
                            //         if(index < end)
                            //         {
                            //             if(!(index % 2))
                            //             {
                            //                 console.log(index)
                            //                 cardContainer.innerHTML = spays[index / 2].card
                            //             }
                            //             else
                            //                 cardContainer.innerHTML = backCard
                            //         }
                            //         index++
                            //     })
                            // }
                        })
                    }
                })
            }
        })
    }
}