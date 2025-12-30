// dashboard.ts

import { renderNavBar } from "./navbar";
import { renderSidebar } from "./sidebar";
import { navBarLogic } from "./navbar";
import { sidebarLogic } from "./sidebar";

export function showDashboard() {
  const app = document.getElementById("login-app");
  if (!app) return;

  document.body.classList.remove("flex", "items-center", "justify-center", "px-6", "md:px-20");
  // document.body.classList.add("bg-gray-900", "min-h-screen");
  //TODO hadi ba9i dak tol fih mochekil 
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
                max-h-[80vh] md:max-h-[87vh] w-full">

            <div class="h-full flex flex-col justify-center items-center text-center">
            </div>

          </div>
        </div>
    </div>
  `;

  // Render sidebar + navbar
  const nav = document.getElementById("navbar");
  const sidebar = document.getElementById("sidebar");
  if (nav) nav.innerHTML = renderNavBar();
  if (sidebar) sidebar.innerHTML = renderSidebar();
  navBarLogic();
  sidebarLogic();
}
