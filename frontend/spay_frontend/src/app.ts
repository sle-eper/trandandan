import {renderNavBar} from '../../auth_frontend/src_auth/dashboard/navbar'
import {renderSidebar} from '../../auth_frontend/src_auth/dashboard/sidebar'
import { renderGameMode } from './component/gameMode';
import { renderLocalMode } from './component/localMode';
import { renderPlayers } from './component/players';
import { roleDistribution } from './component/roleDistribution';
import { renderBackCard } from './component/roleDistribution';
import { renderSection,selectSection } from './component/sections';
import {PlayerAndSpaySelection} from "./component/PlayerAndSpaySelection.ts"
import { findingSpy } from './component/findingSpy.ts';

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
    const game = document.getElementById("spay-content")
    const data = {
        players:0,
        spays:0,
    }
    const selected: string[] = []
    selected.push('1');


    game?.addEventListener("click",(e)=>{
            const el = e.target as HTMLElement;
            console.log(el.id)
            if(el.id === 'localMode')
                game.innerHTML = renderLocalMode() + renderSection() + PlayerAndSpaySelection("players",7) + PlayerAndSpaySelection("spays",1) 
            if(el.id === 'spaysCard' || el.id === 'spaysInput')
            {
                let spaysNumber:number = Number(document.getElementById("counter-value-spays")?.innerText);
                document.getElementById("local-mode")?.classList.add('hidden')
                document.getElementById("counter-spays")?.classList.remove('hidden')
                const plus = document.getElementById("counter-increase-spays");
                const minus = document.getElementById("counter-decrease-spays");
                if(plus && !plus.dataset.bound)
                {
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
                    plus.dataset.bound = "true";
                }
                if(minus && !minus.dataset.bound)
                {
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
                    minus.dataset.bound = "true"
                }
                const confirm = document.getElementById("confirm-spays")
                if(confirm && !confirm.dataset.bound)
                {
                    confirm.addEventListener("click",()=>{
                        console.log(spaysNumber)
                        if(spaysNumber > 0 && spaysNumber <= 3 )
                        {
                            document.getElementById("local-mode")?.classList.remove('hidden')
                            document.getElementById("counter-spays")?.classList.add('hidden')
                            const playerInput = document.getElementById("spaysInput");
                            if(playerInput) playerInput.innerHTML = String(spaysNumber)
                        }
                    })
                    confirm.dataset.bound = "true"
                }
            }
            if(el.id === 'playersCard' || el.id === 'playersInput')
            {
                let playerNumber:number = Number(document.getElementById("counter-value-players")?.innerText);
                document.getElementById("local-mode")?.classList.add('hidden')
                document.getElementById("counter-players")?.classList.remove('hidden')
                const plus = document.getElementById("counter-increase-players");
                const minus = document.getElementById("counter-decrease-players");
                if(plus && !plus.dataset.bound)
                {
                    plus.addEventListener("click",()=>{
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
                    plus.dataset.bound = "true"
                }
                if(minus && !minus.dataset.bound)
                {
                    minus.addEventListener("click",()=>{
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
                    minus.dataset.bound = "true"
                }
                const confirm = document.getElementById("confirm-players")
                if(confirm && !confirm.dataset.bound)
                {
                    confirm.addEventListener("click",()=>{
                        if(playerNumber > 0 && playerNumber <= 10)
                        {
                            document.getElementById("local-mode")?.classList.remove('hidden')
                            document.getElementById("counter-players")?.classList.add('hidden')
                            const playerInput = document.getElementById("playersInput");
                            if(playerInput) playerInput.innerHTML = String(playerNumber)
                        }
                        
                    })
                    confirm.dataset.bound = "true"
                }
            }
            if(el.id === 'sectionsCard' || el.id === 'sectionInput' )
            {
                    selectSection(selected)//TODO 3lach hena khedama ola habetha ltahet la 
                    document.getElementById("local-mode")?.classList.add('hidden')
                    document.getElementById("sections-selection")?.classList.remove('hidden')
                    const confirmSections = document.getElementById("confirm-sections");
                    if(confirmSections && !confirmSections.dataset.bound )
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
                        confirmSections.dataset.bound = 'true'
                    }
            }
            if(el.id === 'next')
            {
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
                        // console.log(data.spays,data.players)
                        game.innerHTML = renderPlayers(data) 
                    }

            }
            if(el.id === 'play')
            {
                const players = []
                for(let i = 0 ; i < data.players ; i++)
                {
                    let p:HTMLInputElement = document.getElementById(`player-${i+1}`) as HTMLInputElement
                    if(p)
                        players.push({id:i+1,name:p.value,spay:false,card:''});
                }
                //kanfar9 3lihom roles 
                const spays = roleDistribution(players,data.players,data.spays,selected)
                // carts kayt9elbo hena 
                game.innerHTML = `<div id="cards-container"></div>`;
                const backCard = renderBackCard()
                let index = 0;
                const end = spays.length * 2;
                const cardContainer = document.getElementById("cards-container");
                if(cardContainer) 
                {
                    cardContainer.innerHTML = backCard
                    cardContainer.addEventListener('click',()=>{
                        if(index < end)
                        {
                            if(!(index % 2))
                            {
                                cardContainer.innerHTML = spays[index / 2].card
                            }
                            else
                                cardContainer.innerHTML = backCard
                        }
                        if(index === end)//weslat card lkhera 
                            game.innerHTML=findingSpy()
                        index++
                    })
                }
            }
            if(el.id === 'new-game')
            {
                game.innerHTML = renderLocalMode() + renderSection() + PlayerAndSpaySelection("players",7) + PlayerAndSpaySelection("spays",1) 
            }
        }
    )
}