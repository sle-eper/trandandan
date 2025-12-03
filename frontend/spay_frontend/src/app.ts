import {renderNavBar} from '../../auth_frontend/src_auth/dashboard/navbar'
import {renderSidebar} from '../../auth_frontend/src_auth/dashboard/sidebar'
import { renderGameMode } from './component/gameMode';
import { renderLocalMode,handelNum } from './component/localMode';
import { renderPlayers } from './component/players';
import { roleDistribution } from './component/roleDistribution';
import { renderBackCard } from './component/roleDistribution';
import { renderSection,selectSection } from './component/sections';

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
            main.innerHTML = renderLocalMode()
            main.innerHTML += renderSection()
            // max arg//////////////////////////
            handelNum("playersInput",10)
            handelNum("spaysInput",3)
            ////////////////////////////////////
            const next = document.getElementById("next");
            const section = document.getElementById("sections");//card of sections
            if(section)
            {
                const selected: string[] = []
                selectSection(selected)//TODO 3lach hena khedama ola habetha ltahet la 

                section.addEventListener('click',()=>{
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
                    const playersInput:HTMLInputElement = document.getElementById("playersInput") as HTMLInputElement;
                    const spaysInput:HTMLInputElement = document.getElementById("spaysInput") as HTMLInputElement;
                    const numberOfPlayer = Number(playersInput.value)
                    const numberOfSpays = Number(spaysInput.value)
                    if(playersInput && numberOfPlayer > 0 && numberOfPlayer <= 10 )
                        data.players =  Number(playersInput.value);
                    if(spaysInput && validNumberOfSpays(numberOfPlayer,numberOfSpays))
                        data.spays = Number(spaysInput.value);
                    //////////////////////////////////////////////////////////////////////////////////////////
                    // console.log(data);
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