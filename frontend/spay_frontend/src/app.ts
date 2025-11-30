import {renderNavBar} from '../../auth_frontend/src_auth/dashboard/navbar'
import {renderSidebar} from '../../auth_frontend/src_auth/dashboard/sidebar'
import { renderGameMode } from './component/gameMode';
import { renderLocalMode,handelNum } from './component/localMode';
import { renderPlayers } from './component/players';
import { roleDistribution } from './component/roleDistribution';


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
const main = document.getElementById("spay-content")
if(main)
{
    main.innerHTML = renderGameMode()
    const localMode = document.getElementById("localMode")
    if(localMode)
    {
        const data = {
            players:0,
            spays:0,
        }

        localMode.addEventListener('click',()=>{
            main.innerHTML = renderLocalMode()
            handelNum("playersInput",10)
            handelNum("spaysInput",3)
            const next = document.getElementById("next");
            if(next)
            {
                next.addEventListener('click',()=>{
                    const playersInput:HTMLInputElement = document.getElementById("playersInput") as HTMLInputElement;
                    const spaysInput:HTMLInputElement = document.getElementById("spaysInput") as HTMLInputElement;
                    if(playersInput)data.players =  Number(playersInput.value);
                    if(spaysInput)data.spays = Number(spaysInput.value);
                    // console.log(data);
                    main.innerHTML = renderPlayers(data) 

                    const play = document.getElementById("play");
                    if(play)
                    {
                        play.addEventListener('click',()=>{
                            const players = []
                            for(let i = 0 ; i < data.players ; i++)
                            {
                                let p:HTMLInputElement = document.getElementById(`player-${i+1}`) as HTMLInputElement
                                if(p)
                                    players.push({id:i+1,name:p.value,spay:false,card:''});
                            }
                            // console.log(players,data.spays)
                            const spays = roleDistribution(players,data.players,data.spays)
                            main.innerHTML = `<div id="cards-container"></div>`;
                            const cardContainer = document.getElementById("cards-container");
                            let index = 0;
                            if(cardContainer) 
                                cardContainer.innerHTML = spays[index].card
                            cardContainer?.addEventListener('click',()=>{
                                index++
                                if(index < spays.length)
                                    cardContainer.innerHTML = spays[index].card
                            })

                            // console.log(spays[0].card)
                            // const container = document.getElementById("cards-container");
                            // spays.forEach((p:any)=>{
                            //     index++
                            //     if(index <)
                            //     const div = document.createElement("div");
                            //     div.innerHTML = p.card;
                            //     container.appendChild(div);
                            // });
                        })
                    }
                })
            }
        })
    }
}