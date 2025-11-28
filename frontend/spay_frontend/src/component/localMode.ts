
import spays from "../img/spays.png"


export function handelNum()
{
    const spaysInput = document.getElementById("spaysInput") as HTMLLIElement ;
    if(spaysInput)
    {
        spaysInput.addEventListener('keyup',()=>{//TODO handel >10 and <1
            const value:number =  spaysInput.value;
            if(value > 10  )
                spaysInput.value = 10;
            // else if(value < 1)
            //     spaysInput.value = 1;
        })
    }
}

export function renderLocalMode(defaultSpiesCount: number = 3):string
{
    const hideSpinnersStyle = `style="-moz-appearance: textfield;"`
    return `
        <style>
            input[type=number]::-webkit-outer-spin-button,
            input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
            }
            input[type=number] {
            -moz-appearance: textfield;
            }
        </style>
        <div class ="grid grid-cols-3 gap-4 justify-items-center items-center  w-full h-full border">
            <div class = " relative w-full max-w-[350px] group border" >
                <img src="${spays}" alt="Spy Config Card" class="w-full h-auto object-contain ">
                <div class="absolute bottom-[28%] left-0 right-0 flex justify-center items-center z-10">
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value="${defaultSpiesCount}"
                        ${hideSpinnersStyle}
                        class="w-1/3 bg-transparent text-center text-red-500 font-mono text-5xl font-bold border-none focus:ring-0 focus:outline-none "
                        id= "spaysInput"
                    />
                </div>
            </div>
            <div class = "border">2</div>
            <div class = "border">3</div>
        </div>
    `

}