export function renderNavBar():string
{
    return ` <nav id="nav-bar" class="flex flex-row justify-around items-center" >
                <div class="basis-15">
                    <img  class="w-15 h-15 " src="../img/canvas.png" alt="logo">
                </div>
                <div class="basis-1/3 flex items-center">
                    <input class="w-[400px]  h-8 border-1 border-white rounded-s-lg text-white border-r-0 focus:outline-none" type="text" placeholder="Search">
                    <button class="w-[40px] h-8 border-1 border-white rounded-tr-lg rounded-br-lg text-white border-l-0 "> <span class="material-symbols-outlined h-6">search</span></button>
                </div>
                <div class="basis-15" >
                    <button class="w-10 h-10 rounded-full border-white border-1  bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#2A2A2A] hover:bg-[linear-gradient(to_right,#D73B3F,#FD1D1D,#711F21)] ">
                        <span class="material-symbols-outlined color text-white">notifications</span>
                    </button>
                </div> 
            </nav>`
};