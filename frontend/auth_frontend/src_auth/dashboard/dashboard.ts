// dashboard.ts

import { renderNavBar } from "./navbar";
import { renderSidebar } from "./sidebar";
import { navBarLogic } from "./navbar";
import { sidebarLogic } from "./sidebar";
// import { socket } from "../login/login";
import { getSocketInstance } from "../../../socket_manager/socket";
// import { socketInstance } from "../../../socket_manager/socket";
import { createNotificationMenuItem } from "../../../profile_frontend/src/components/RequestHandling";
import { socketNotificationListener } from "../../../chat-frontend/src/ts/chat_socket";
import { setCurrentUserId } from "../../../chat-frontend/src/ts/global_var";


function addNotif(el: any, notification: HTMLElement) {
  const notifIcon = document.getElementById("notif-icon");
  if (!notifIcon) return;
  // red notification icon
  notifIcon.innerHTML = `<span class=" text-[#E63946]  material-symbols-outlined">
                          notifications_unread
                          </span>`

  let text = "";
  console.log("Adding notification:", el, el.type);
  switch (el.type) {
    case "challenge":
      text = `🎮 <strong>${el.sender_name}</strong> wants to play`;
      break;

    case "reject":
      text = `❌ <strong>${el.sender_name}</strong> rejected your play request`;
      break;

    case "msg":
      text = `💬 <strong>${el.sender_name}</strong>: ${el.content}`;
      break;

    case "friendRequest":
      console.log("Creating menu item for notifId:", el);
      createNotificationMenuItem(notification, el.sender_name, el.send, el.id, el.recv);
      return;

    default:
      return;
  }

  const msgNotif = document.createElement("div");
  msgNotif.className = `
    w-full text-left px-4 py-2 text-white/90 
    hover:bg-[#E63946]/20 transition rounded-lg
  `;

  msgNotif.innerHTML = `
    <div class="flex justify-between">
      <span class="block max-w-70 truncate">${text}</span>
      <span class="hover:cursor-pointer close-btn material-symbols-outlined">close</span>
    </div>
  `;

  msgNotif.querySelector(".close-btn")?.addEventListener("click", () => {
    getSocketInstance()?.emit("removeNotif", el.id);
    msgNotif.remove();
    const notifmenu = document.getElementById("notification-menu");
    if (notifmenu?.children.length === 0) {
      if (notifmenu.classList.contains("hidden")) return;
      notifmenu.classList.add("opacity-0");
      notifmenu.classList.add("hidden")
      notifIcon.innerHTML = `<span class="  material-symbols-outlined">
                            notifications
                            </span>`
    }
  });

  notification.prepend(msgNotif);
}



export async function showDashboard() {
  const app = document.getElementById("login-app");
  if (!app) return;

  document.body.classList.remove("flex", "items-center", "justify-center", "px-6", "md:px-20");
  app.innerHTML = `
      <div class="flex flex-col h-screen bg-[#111] text-white">
          
          <!-- Navbar -->
          <div id="navbar"></div>
          
          <div class="flex flex-row flex-grow">
            <!-- Sidebar -->
            <div id="sidebar"></div>
          <div id="dashboard-content"
            class="flex items-center justify-center p-6 rounded-3xl
                  bg-gradient-to-br from-[#1a1a1d] to-[#0f0f11]
                  shadow-xl border border-[#2c2c2f]
                  mx-6 mt-4 mb-6 overflow-auto
                  max-h-[80vh] md:max-h-[87vh] w-full relative">

              <div class="h-full flex flex-col justify-center items-center text-center">
              </div>

            </div>
          </div>
      </div>
    `;

  function getnotif(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("/auth/verify", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const responseJson = await response.json();
        const myId = responseJson.id;

        getSocketInstance()?.once("notif", (data) => {
          resolve(data);
        });

        getSocketInstance()?.emit("getNotif", myId);
      } catch (err) {
        reject(err);
      }
    });
  }

  // Render sidebar + navbar
  const nav = document.getElementById("navbar");
  const sidebar = document.getElementById("sidebar");

  if (sidebar) sidebar.innerHTML = renderSidebar();
  if (nav) nav.innerHTML = renderNavBar();

  // Verify user and set up socket listeners
  try {
    const response = await fetch("/auth/verify", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // VERY IMPORTANT FOR Cookies
    });
    const responseJson = await response.json()
    const userID = responseJson.id as string;
    setCurrentUserId(userID);

    // Initialize socket notification listener
    socketNotificationListener();

    // Get notifications and display them
    let notif = await getnotif()
    const notification = document.getElementById("notification-menu");
    if (notification) {
      notif.forEach((el) => {
        if (el.display) {
          addNotif(el, notification);
        }
      });
    }
  } catch (error) {
    console.error("Error initializing dashboard:", error);
  }

  // Apply logic handlers after everything is rendered
  navBarLogic();
  sidebarLogic();
}