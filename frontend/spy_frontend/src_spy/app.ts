import { renderLocalMode } from './component/localMode.ts';
import { renderPlayers } from './component/players.ts';
import { roleDistribution } from './component/roleDistribution.ts';
import { renderBackCard } from './component/roleDistribution.ts';
import { renderSection,selectSection,setSectionBound } from './component/sections.ts';
import {PlayerAndSpaySelection} from "./component/PlayerAndSpaySelection.ts"
import { findingSpy } from './component/findingSpy.ts';
import { displayCard } from './component/localMode.ts';
import { history } from './component/history.ts';

// //start og game 
let correctChoice:string;

export function setCorrectChoice(value:string)
{
    correctChoice = value.toLocaleLowerCase()
}

export async function spyUi()
{
    const main = document.getElementById("dashboard-content")
    const response = await fetch("http://localhost:8080/auth/verify", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // VERY IMPORTANT FOR Cookies
        });
        let myId: string;
        const responseJson = await response.json()
        myId =  responseJson.id;
        const userName = responseJson.username;
        // console.log(responseJson)
            
    if(main)
    {
       //show game mode
        main.innerHTML = renderLocalMode() + renderSection() + PlayerAndSpaySelection("players",3) + PlayerAndSpaySelection("spays",1) /* + await history(myId) */
        const game = document.getElementById("dashboard-content")
        const data = {
            players:0,
            spays:0,
        }
        const selected: string[] = []
        selected.push('1');
        let index:number = 0;
        let playerNumber:number = 7;
        let spaysNumber:number = 1;

        let currentIndex:number = 0;
        let spaysNumberlit3arfo:number = 0;

        let whoAsks
        let spays
        let click:number = 0;
        let player1;
        // let correctChoice:string;
        game?.addEventListener("click",async(e)=>{
                const el = e.target as HTMLElement;
                console.log(el.id)
                if(el.id === 'historyCard')
                {
                    document.getElementById("local-mode")?.classList.add('hidden')
                    const historySection = document.getElementById("historySection")
                    if(historySection)
                        historySection.remove()
                    main.innerHTML += await history(myId)
                    const historySection2 = document.getElementById("historySection")
                    historySection2?.classList.remove('hidden')
                }
                if(el.id === 'confirm-btn')
                {
                    document.getElementById("local-mode")?.classList.remove('hidden')
                    document.getElementById("historySection")?.classList.add('hidden')
                }
                if(el.id === 'spaysCard' || el.id === 'spaysInput')
                {
                    spaysNumber = Number(document.getElementById("counter-value-spays")?.innerText);
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
                            console.log("spaysNumber",spaysNumber)
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
                    playerNumber = Number(document.getElementById("counter-value-players")?.innerText);
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
                        selectSection(selected)
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
                        // console.log(data.spays,data.players);
                        if(data.spays && data.players)
                        {
                            // console.log(data.spays,data.players)
                            game.innerHTML = renderPlayers(data,userName) 
                        }
    
                }
                function ask(spy:any):object
                {
                    return [...spy].sort(() => Math.random() - 0.5);
                }
                function renderSpyChoice():string
                {
                    return `
                    <div id="choice-screen" class="flex flex-col items-center justify-center gap-6 h-full">
                        <button id="guess-the-word"
                                class="w-70 px-10 py-4 text-xl font-bold rounded-lg 
                                    bg-[#ff4d4d] text-white shadow-lg
                                    hover:bg-[#e63939] hover:scale-105 
                                    transition-all duration-200 cursor-pointer
                                    font-['Share_Tech_Mono'] tracking-wider">
                            GUESS THE WORD
                        </button>
                        <button id="choose-spy"
                                class="w-70 px-10 py-4 text-xl font-bold rounded-lg 
                                    bg-[#ff4d4d] text-white shadow-lg
                                    hover:bg-[#e63939] hover:scale-105 
                                    transition-all duration-200 cursor-pointer
                                    font-['Share_Tech_Mono'] tracking-wider">
                            CHOOSE SPY
                        </button>
                    </div>
                    `
                }
                function hadlhebla(spays)
                {
                    currentIndex = 0
                    whoAsks = ask(spays)
                    console.log("whoAsks",whoAsks)
                    // console.log("spays",spays)
                    // Who should ask 
                    game!.innerHTML = `
                                    <div class="flex flex-col items-center justify-center gap-10 py-12">
                                        <div class="text-3xl font-bold uppercase text-[#ff4d4d]
                                            tracking-wider font-['Share_Tech_Mono']
                                            [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
                                                Who should ask
                                        </div>
                                        <div id="current-id" class="text-2xl font-bold font-['Share_Tech_Mono'] tracking-wide text-center">
                                            ${whoAsks[currentIndex].name}
                                        </div>
                                        <button id="next-btn-ask"
                                                class="px-10 py-4 text-xl font-bold rounded-lg 
                                                    bg-[#ff4d4d] text-white shadow-lg
                                                    hover:bg-[#e63939] hover:scale-105 
                                                    transition-all duration-200 cursor-pointer
                                                    font-['Share_Tech_Mono'] tracking-wider">
                                            NEXT
                                        </button>
                                    </div>
                                                    `
                }
                function chooseSpy(players): string {//TODO tol dyaal select 
                    return `
                        <div id="choose-spy" 
                            class="flex flex-col items-center justify-center gap-8 py-12">

                            <!-- Title -->
                            <div class="text-3xl font-bold uppercase text-[#ff4d4d]
                                        tracking-wider font-['Share_Tech_Mono']
                                        [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
                                Choose the Spy
                            </div>

                            <!-- Select box -->
                            <select id="spy-select"
                                class="w-64 px-4 py-3 text-lg rounded-lg
                                    bg-[#1a1a1a] text-white
                                    border-2 border-[#ff4d4d]
                                    focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]
                                    font-['Share_Tech_Mono'] tracking-wide">
                                <option value="" disabled selected>
                                    Select player
                                </option>
                                ${players.map(p => `
                                    <option value="${p.id}">${p.name}</option>
                                `).join("")}
                            </select>
                            <div id="spy-result"></div>

                            <!-- Confirm button -->
                            <button id="confirm-spy"
                                class="px-10 py-4 text-xl font-bold rounded-lg 
                                    bg-[#ff4d4d] text-white shadow-lg
                                    hover:bg-[#e63939] hover:scale-105 
                                    transition-all duration-200 cursor-pointer
                                    font-['Share_Tech_Mono'] tracking-wider">
                                CONFIRM
                            </button>
                        </div>
                    `;
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
                    spays = roleDistribution(players,data.players,data.spays,selected)
                    console.log(spays)
                    player1 = spays[0];
                    console.log("in paly " , player1)
                    // carts kayt9elbo hena 
                    game.innerHTML = `<div id="cards-container"></div>`;
                    const backCard = renderBackCard()
                    let index = 0;
                    const end = spays.length * 2;
                    const cardContainer = document.getElementById("cards-container");
                    if(cardContainer) 
                    {
                        cardContainer.innerHTML = `<div class="text-2xl sm:text-3xl flex justify-center font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                            [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000] select-none">${spays[0].name}</div>`
                        cardContainer.innerHTML += backCard
                        let validIndex:number
                        cardContainer.addEventListener('click',()=>{
                            if(index < end)
                            {
                                if(!(index % 2))
                                {
                                    validIndex = index / 2;
                                    cardContainer.innerHTML = spays[validIndex].card
                                }
                                else
                                {
                                    if(spays[validIndex + 1]){
                                        cardContainer.innerHTML = `<div class="text-2xl sm:text-3xl flex justify-center font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                                        [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000] select-none">${spays[validIndex + 1].name}</div>`
                                        cardContainer.innerHTML += backCard
                                    }else
                                        cardContainer.innerHTML = backCard
                                }
                            }
                            // if(index === end)//weslat card lkhera 
                            //     game.innerHTML=findingSpy()
                            if(index === end)
                            {
                                hadlhebla(spays)
                            }
                            index++
                            // console.log("sssssssssssssssssss",index)
                                // console.log("ssss")
                        })
                    }
                }
                if(el.id === 'new-game')
                {
                    setSectionBound(false);
                    currentIndex = 0;
                    whoAsks = ''
                    spays = ''
                    game.innerHTML = renderLocalMode(playerNumber,spaysNumber,selected.length) + renderSection() + PlayerAndSpaySelection("players",playerNumber) + PlayerAndSpaySelection("spays",spaysNumber) 
                }
                if(el.id === 'next-btn' || el.id === 'next-btn-logo')
                {
                    if(index < 3)
                        index++
                    displayCard(index);
                }
                if(el.id === 'back-btn' || el.id === 'back-btn-logo')
                {
                    if(index > 0)
                        index--
                    displayCard(index);
                }
                if(el.id === 'next-btn-ask')
                {
                    const display = document.getElementById("current-id");
                    // const nextBtn = document.getElementById("next-btn");
                    // console.log(Boolean(display),Boolean(nextBtn))
                    currentIndex++;
                    // console.log(whoAsks[currentIndex])
                    if (currentIndex < whoAsks.length){
                            display.textContent = whoAsks[currentIndex].name;

                        } else {
                            game.innerHTML = renderSpyChoice()
                        }
                }
                if(el.id === 'guess-the-word')
                {
                    console.log(correctChoice)
                    game.innerHTML = `<div class="h-full w-full flex flex-col items-center justify-center gap-8">

                        <h1 class="text-4xl font-bold uppercase text-[#ff4d4d]
                            font-['Share_Tech_Mono']
                            [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]">
                            GUESS THE WORD
                        </h1>

                        <input
                            id="confirm-guess-input"
                            type="text"
                            placeholder="Enter the word..."
                            class="w-[300px] px-5 py-4 text-lg rounded-xl
                            bg-[#1a1a1a] text-white border-2 border-[#ff4d4d]
                            focus:outline-none focus:ring-2 focus:ring-[#ff4d4d]"
                        />

                        <button id="confirm-guess"
                            class="px-10 py-4 text-xl font-bold rounded-xl
                            bg-[#ff4d4d] text-white shadow-lg
                            hover:bg-[#e63939] hover:scale-105
                            transition-all duration-200">
                            CONFIRM
                        </button>

                    </div>`
                }
                if(el.id === 'confirm-guess')
                {
                    const value = document.getElementById("confirm-guess-input")?.value;
                    if(value.trim())
                    {
                        // console.log(correctChoice)
                        if(value.toLocaleLowerCase() === correctChoice)
                        {
                            if(player1.spay === true)
                            {
                                await fetch('http://localhost:3003/history',{
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ user_id: myId,role:'spy',result:'win'}),
                                })//TODO handel errors
                            }else{
                                await fetch('http://localhost:3003/history',{
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ user_id: myId,role:'investigator',result:'lose'}),
                                })//TODO handel errors
                            }
                            game.innerHTML=findingSpy("The spy won")
                        }
                        else{
                            if(player1.spay === true)
                            {
                                await fetch('http://localhost:3003/history',{
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ user_id: myId,role:'spy',result:'lose'}),
                                })//TODO handel errors
                            }else{
                                await fetch('http://localhost:3003/history',{
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ user_id: myId,role:'investigator',result:'win'}),
                                })//TODO handel errors
                            }
                            game.innerHTML=findingSpy("The investigators won")
                        }
                    }
                }
                if(el.id === 'choose-spy')
                {
                    game.innerHTML = chooseSpy(whoAsks)
                }
                if(el.id === 'confirm-spy')
                {
                    // console.log("click 1",click)
                    const select = document.getElementById("spy-select") as HTMLSelectElement;
                    const result = document.getElementById("spy-result") as HTMLDivElement;
                    const id = Number(select.value);

                    if (!id) {
                        alert("Please choose a spy!");
                        return;
                    }
                    const section =  whoAsks.find((s)=>{
                        return s.id == id
                    })
                    if(section.spay === true && click === 0)
                    {
                        spaysNumberlit3arfo++
                        select.classList.add('hidden')
                        result.innerHTML = `<div class="text-2xl font-bold  font-['Share_Tech_Mono'] tracking-wide text-center">${section.name} ${spaysNumber - spaysNumberlit3arfo === 0 ? '': ` , is spy but but there are still ${spaysNumber - spaysNumberlit3arfo}`}`
                    }
                    else
                    {
                        select.classList.add('hidden')
                        result.innerHTML = `<div class="text-2xl font-bold  font-['Share_Tech_Mono'] tracking-wide text-center">${section.name}, is not spy.`
                    }
                    
                    click++
                    spays = whoAsks.filter(s => s.id !== id);

                    console.log(spaysNumberlit3arfo,spaysNumber)

                    if(spaysNumberlit3arfo === spaysNumber)
                    {
                        console.log("investigators won " , player1)
                        if(!player1.spay === true)
                        {
                            await fetch('http://localhost:3003/history',{
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ user_id: myId,role:'investigator',result:'win'}),
                                })//TODO handel errors
                        }
                        else
                        {
                            await fetch('http://localhost:3003/history',{
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user_id: myId,role:'spy',result:'lose'}),
                            })//TODO handel errors
                        }
                        game.innerHTML=findingSpy("The investigators won")
                        return
                    }
                    else if(spays.length === 2)
                    {
                        // const win = section.find((s) => {
                        //     return s.id === 1
                        // })
                        console.log("The spy won " , player1)
                        if(player1.spay === true)
                        {
                            await fetch('http://localhost:3003/history',{
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ user_id: myId,role:'spy',result:'win'}),
                                })//TODO handel errors
                        }else{
                                await fetch('http://localhost:3003/history',{
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ user_id: myId,role:'investigator',result:'lose'}),
                                })//TODO handel errors
                        }
                        game.innerHTML=findingSpy("The spy won")
                        return
                    }
                    console.log("click 2",click)
                    if(click === 2)
                    {
                        click = 0;
                        hadlhebla(spays)
                    }
                }
            }
        )
    }

}