import {renderNavBar} from '../../auth_frontend/src_auth/dashboard/navbar'
import {renderSidebar} from '../../auth_frontend/src_auth/dashboard/sidebar'
import { renderGameMode } from './component/gameMode';
import { renderLocalMode,handelNum } from './component/localMode';
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
        localMode.addEventListener('click',()=>{
            main.innerHTML = renderLocalMode()
            handelNum()
        })
    }
}