import spaySections from "../sectionsData/sectionsData"
import sectionName from "../img/sectionName.png"

let sectionBound = false;
export function selectSection(selected: string[] )
{
    if (sectionBound) return;  // ⛔ لا تعيد إضافة الأحداث
    sectionBound = true;
    document.querySelector(`[data-id="1"]`)?.classList.remove("border-transparent");
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
                element?.classList.add("border-transparent");
            }else{
                selected.push(id);
                element?.classList.remove("border-transparent");
            }
        })
    })
}



export function renderSection():string
{
    let content = `<div id="sections-selection" class="hidden grid grid-cols-3 gap-15">`
    content +=  spaySections.map(s=>{
        return`
            <div class = "section-card relative card cursor-pointer transition-transform duration-200 
                        hover:scale-105  border-2 border-transparent rounded-[4px]"
                        data-id="${s.id}">
                <img src='${sectionName}' class="h-60 w-60 ">
                <div class="absolute bottom-[45%] left-0 right-0 flex justify-center items-center z-10
                        text-xl font-bold uppercase text-[#ff4d4d] tracking-wide font-['Share_Tech_Mono'] [text-shadow:0_0_5px_#ff0000,0_0_15px_#ff0000]
                        ">
                            ${s.sectionName}
                </div>
            </div>
        `
    }).join("\n")
    //TODO hadi khasni nfham dakchi deyalha 
    content += `
        <div class="col-span-3 w-full flex justify-center mt-10">
            <button id="confirm-sections"
                    class="px-10 py-4 text-xl font-bold rounded-lg 
                        bg-[#ff4d4d] text-white shadow-lg
                        hover:bg-[#e63939] hover:scale-105 
                        transition-all duration-200 cursor-pointer
                        font-['Share_Tech_Mono'] tracking-wider">
                CONFIRM SELECTION
            </button>
        </div>
    </div>
    `
    return content
}