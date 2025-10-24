export function renderNavBar():string
{
    return ` <nav id="nav-bar" class="flex flex-row items-center" >
                <div class=" ml-10 flex justify-start">
                    <img  class="w-15 h-15 " src="./src/img/canvas.png" alt="logo">
                </div>
                <div class="flex items-center justify-between w-[90%] "> 
                    <div class="flex items-center border-1 border-white rounded-lg ml-45 ">
                        <input class="w-[400px] h-8  text-white  focus:outline-none focus:border-[#E63946]  pl-3" type="text" placeholder="Search">
                        <button class=" flex items-center w-[40px] h-8 text-white "> <span class="material-symbols-outlined h-6">search</span></button>
                    </div>
                    <div class=" mr-20" >
                        <button class="w-10 h-10 rounded-full border-white border-1 hover:border-[#FD1D1D] ">
                            <span class="material-symbols-outlined color text-white">notifications</span>
                        </button>
                    </div> 
                    
                </div>
            </nav>`
};