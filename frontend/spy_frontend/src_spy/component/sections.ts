import spaySections from "../sectionsData/sectionsData"

let sectionBound:boolean = false;

export function setSectionBound(value: boolean) {
    sectionBound = value;
}

export function selectSection(selected: string[] )
{
    if (sectionBound) return;
    sectionBound = true;
    selected.forEach(s=>{
        const element = document.querySelector(`[data-id="${s}"]`);
        element?.classList.add("bg-[#ff4d4d]");
    })
    const cards = document.querySelectorAll(".section-card");
    cards.forEach(c =>{
        c.addEventListener('click',()=>{
            const id  = c.getAttribute("data-id")
            const element = document.querySelector(`[data-id="${id}"]`);
            if(!id) return;
            const index = selected.indexOf(id);
            if(index !== -1)
            {
                selected.splice(index,1)
                element?.classList.remove("bg-[#ff4d4d]");
            }else{
                selected.push(id);
                element?.classList.add("bg-[#ff4d4d]");
            }
        })
    })
}



export function renderSection():string
{
    let content = `<div id="sections-selection" class="hidden grid grid-cols-2  md:grid-cols-3 gap-8">`
    content += `<div class="col-span-2 md:col-span-3  flex justify-center mb-10 text-4xl font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono']
                [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000] select-none">SECTIONS</div>`
    content +=  spaySections.map(s=>{
        return`
            <div class = "section-card flex justify-center items-center text-center h-20 w-30  cursor-pointer transition-transform duration-200 
                        hover:scale-105  border-2  rounded-xl"
                        data-id="${s.id}">
                            ${s.sectionName}
            </div>
        `
    }).join("\n")
    content += `
        <div class="col-span-2 md:col-span-3 w-full flex justify-center mt-10">
            <button id="confirm-sections"
                    class="px-10 py-4 text-xl font-bold rounded-lg 
                        hover:from-[#B32626] hover:to-[#8B1E1E]
                        bg-gradient-to-b from-[#9B1C1C] to-[#6F1414]
                        text-white shadow-lg
                        hover:scale-105 
                        transition-all duration-200 cursor-pointer
                        font-['Share_Tech_Mono'] tracking-wider">
                CONFIRM SELECTION
            </button>
        </div>
    </div>
    `
    return content
}