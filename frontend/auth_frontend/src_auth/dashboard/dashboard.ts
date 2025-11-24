// dashboard.ts

import { renderNavBar } from "./navbar";
import { renderSidebar } from "./sidebar";

export function showDashboard() {
  const app = document.getElementById("login-app");

  if (!app) return;
  
  app.innerHTML = `
  <div class="flex flex-col h-screen bg-[#111] text-white">
      
      <!-- Navbar -->
      <div id="navbar"></div>
      
      <div class="flex flex-row flex-grow">
      <!-- Sidebar -->
      <div id="sidebar"></div>
        
        <!-- Main dashboard content -->
        <div class="flex-grow p-6">
          <h1 class="text-3xl font-bold">Welcome!</h1>
          <p class="text-gray-400 mt-2">You have successfully logged in.</p>
        </div>
      </div>
    </div>
  `;
  
  const nav = document.getElementById("navbar");
  const sidebar =  document.getElementById("sidebar");
  
    if (nav) nav.innerHTML = renderNavBar();
    if (sidebar) sidebar.innerHTML = renderSidebar();

  // Render navbar and sidebar
}
