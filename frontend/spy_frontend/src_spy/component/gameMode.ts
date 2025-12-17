import localMode from '../img/localMode.png'
import onlineMode from '../img/onlineMode.png'


export function renderGameMode(): string {
    return `
        <div id="spay-game" class="flex items-center justify-center gap-50 w-full h-full border">
        
            <div id="localMode" class="w-60 h-90 bg-[url('${localMode}')] bg-cover bg-center 
                        cursor-pointer transition-transform duration-200 
                        hover:scale-105">
            </div>

            <div id="onlineMode" class="w-60 h-90 bg-[url('${onlineMode}')] bg-cover bg-center 
                        cursor-pointer transition-transform duration-200 
                        hover:scale-105">
            </div>

        </div>
    `;
}
