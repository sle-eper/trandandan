import {renderNavBar} from "../components/navbar"
import {renderSidebar} from "../components/sidebar"
import { listOfMsg } from "../components/listOfMsg";
import { DM } from "../components/dm";


const nav = document.getElementById('nav-bar');
// const layout = document.getElementById('layout');
const sidebar = document.getElementById('side-bar');
const chatContent = document.getElementById('chat-content')

// if(layout)
if(nav) nav.innerHTML = renderNavBar();
if(sidebar) sidebar.innerHTML = renderSidebar();
if(chatContent){
    chatContent.innerHTML = listOfMsg();
    chatContent.innerHTML += DM();
}






//root of page
// const app = document.getElementById("app");


// // create heder tag 
// const header = DOM.createElement("header");
// /* ****************************************************** */
// const nav =  DOM.createChild(header,"nav","flex" ,"flex-row", "justify-around", "items-center");
// /* ****************************************************** */
// const rightDiv = DOM.createChild(nav,"div","basis-15");
// const middleDiv = DOM.createChild(nav,"div","basis-1/3", "flex" ,"items-center");
// const liftDiv = DOM.createChild(nav,"div","basis-15");
// /* *************************************************************************** */
// const logo = DOM.createImg({src:'./img/canvas.png',alt:"logo",classes:["h-w-16"]});
// rightDiv.append(logo);
// /* *************************************************************************** */
// const search = DOM.createInput({type:"text",placeholder:"Search",classes : ["Search","w-[400px]","h-8" ,"border-1","border-white","rounded-tl-lg","rounded-bl-lg","text-white","border-r-0","focus:outline-2", "focus:outline-offset-2", "focus:outline-[#FFB3B3]" ,"active:bg-violet-700"]});
// middleDiv.append(search);

// const searchButton = DOM.createButton({classes : ["w-[40px]" ,"h-8" ,"border-1","border-white","rounded-tr-lg","rounded-br-lg","text-white","border-l-0"]})

// const searchImg = DOM.createSpan({textContent:"search",classes:["material-symbols-outlined" ,"h-6"]})
// searchButton.append(searchImg);
// middleDiv.append(searchButton);

// /* *************************************************************************** */
// const notificationsButton = DOM.createButton({classes : ["w-10","h-10" ,"rounded-full" ,"border-white" ,"border-1"  ,"bg-black" ,"hover:bg-[linear-gradient(to_right,#C0392B,#D8585E,#FFB3B3)]"]});

// const notificationsImg = DOM.createSpan({textContent:"notifications",classes:["material-symbols-outlined" ,"color" ,"text-white"]})
// notificationsButton.append(notificationsImg);
// liftDiv.append(notificationsButton);
// app?.append(header)
