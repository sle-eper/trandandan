// import { showDashboard } from "./dashboard/dashboard";
// // ----------------------
// // Types
// // ----------------------
// type PageId = "login-page" | "signup-page" | "forgot-page" | "change-page";

// interface ImageMap {
//   [key: string]: string;
// }

// interface PageTemplateMap {
//   [key: string]: string;
// }

// // ----------------------
// // Image map
// // ----------------------
// const images: ImageMap = {
//   "login-page": "/login_page/images/pingpong2.jpg",
//   "signup-page": "/login_page/images/pingpong1.jpg",
//   "forgot-page": "/login_page/images/pingpong3.jpg",
//   "change-page": "/login_page/images/pingpong1.jpg",
// };

// // ----------------------
// // App container
// // ----------------------
// const app = document.getElementById("login-app") as HTMLElement | null;

// if (!app) {
//   throw new Error("Element #login-app not found in DOM");
// }

// // ----------------------
// // Page templates
// // ----------------------
// const pages: PageTemplateMap = {
//   "login-page": `
//     <div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 
//     px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:w-[320px] flex flex-col justify-between mb-10 md:mb-0">
//       <div>
//         <h2 class="text-2xl md:text-3xl font-bold mb-2">Login</h2>
//         <p class="text-gray-400 mb-6 text-sm md:text-base">Glad you're back!</p>
//         <div class="space-y-4">
//           <input type="text" placeholder="Username" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//           <input type="password" placeholder="Password" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//         </div>
//         <div class="flex items-center mt-3">
//           <input type="checkbox" id="remember" class="mr-2 accent-[#E64249]" />
//           <label for="remember" class="text-gray-300 text-sm">Remember me</label>
//         </div>
//         <button class="w-full bg-gradient-to-r from-[#9E3234] via-[#D8585E] to-[#E64249] text-white py-2 rounded-md mt-4 hover:opacity-90 transition">
//           Login
//         </button>
//         <p class="text-center text-gray-400 text-sm mt-3 cursor-pointer hover:text-white" onclick="showPage('forgot-page')">
//           Forgot password?
//         </p>
//         <div class="flex items-center my-6">
//           <hr class="flex-grow border-gray-700" />
//           <span class="text-gray-500 text-sm mx-3">or</span>
//           <hr class="flex-grow border-gray-700" />
//         </div>
//         <div class="flex items-center justify-center gap-6">
//           <button class="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
//             <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" class="w-9 h-9" />
//           </button>
//           <button class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
//             <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" class="w-9 h-9 invert" />
//           </button>
//         </div>
//       </div>
//       <p class="text-center text-gray-400 text-sm mt-6">
//         Don't have an account?
//         <span class="text-[#E64249] cursor-pointer hover:underline" onclick="showPage('signup-page')">Sign up</span>
//       </p>
//     </div>
//   `,

//   "signup-page": `
//     <div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 
//     px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:w-[320px] flex flex-col justify-between mb-10 md:mb-0">
//       <div>
//         <h2 class="text-2xl md:text-3xl font-bold mb-4">Sign Up</h2>
//         <div class="space-y-4">
//           <input type="text" placeholder="Username" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//           <input type="email" placeholder="Email" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//           <input type="text" placeholder="Confirm Email" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//           <input type="password" placeholder="Password" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//         </div>
//         <button class="w-full bg-gradient-to-r from-[#9E3234] via-[#D8585E] to-[#E64249] 
//         text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
//           Sign Up
//         </button>
//       </div>
//       <p class="text-center text-gray-400 text-sm mt-6">
//         Already have an account?
//         <span class="text-[#E64249] cursor-pointer hover:underline" onclick="showPage('login-page')">Login</span>
//       </p>
//     </div>
//   `,

//   "forgot-page": `
//     <div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 
//     px-8 py-8 md:px-10 md:py-10 w-full max-w-sm h-auto md:h-[550px] flex flex-col justify-between mb-10 md:mb-0">
//       <div>
//         <h2 class="text-2xl md:text-3xl font-bold mb-2">Forgot Password?</h2>
//         <div class="space-y-4 mt-6">
//           <input type="email" placeholder="Email" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//         </div>
//         <button class="w-full bg-gradient-to-r from-[#9E3234] via-[#D8585E] to-[#E64249] 
//         text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
//           Reset Password
//         </button>
//       </div>
//       <p class="text-center text-gray-400 text-sm mt-6">
//         Don’t have an account?
//         <span class="text-[#E64249] cursor-pointer hover:underline" onclick="showPage('signup-page')">Sign up</span>
//       </p>
//     </div>
//   `,

//   "change-page": `
//     <div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 
//     px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:h-[550px] md:w-[320px] mb-10 md:mb-0">
//       <div>
//         <h2 class="text-2xl md:text-3xl font-bold mb-4">Change Password</h2>
//         <div class="space-y-4">
//           <input type="password" placeholder="Password" 
//           class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//           <input type="password" placeholder="Confirm Password" 
//           class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
//         </div>
//         <button class="w-full bg-gradient-to-r from-[#9E3234] via-[#D8585E] to-[#E64249] 
//         text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
//           Change Password
//         </button>
//       </div>
//       <p class="text-center text-gray-400 text-sm mt-6 cursor-pointer hover:text-white" 
//         onclick="showPage('login-page')">
//         Back to Login
//       </p>
//     </div>
//   `
// };

// // ----------------------
// // Shared image template
// // ----------------------
// const sharedImage = (src: string): string => `
//   <div class="flex items-center justify-center md:ml-10">
//     <img id="page-image"
//       src="${src}"
//       alt="Athlete"
//       class="w-[80%] md:w-[500px] object-contain rounded-xl hidden sm:block"/>
//   </div>
// `;

// // ----------------------
// // Show a page
// // ----------------------
// function showPage(pageId: PageId): void {
//   if (!pages[pageId]) return;
//   if (pageId === "login-page") {
//   attachLoginHandler();
// }

//   app!.innerHTML = `
//     <div class="flex flex-col md:flex-row items-center justify-center gap-10 w-full">
//       ${pages[pageId]}
//       ${sharedImage(images[pageId])}
//     </div>
//   `;
// }
// function attachLoginHandler() {
//   const loginBtn = document.querySelector("button") as HTMLButtonElement;
//   if (!loginBtn) return;

//   loginBtn.addEventListener("click", () => {
//     const inputs = document.querySelectorAll("input");
//     const username = (inputs[0] as HTMLInputElement).value.trim();
//     const password = (inputs[1] as HTMLInputElement).value.trim();

//     if (!username || !password) {
//       alert("Please enter username and password");
//       return;
//     }

//     // Go to dashboard page
//     showDashboard();
//   });
// }

// // ----------------------
// // Initialize default page
// // ----------------------
// window.addEventListener("DOMContentLoaded", () => {
//   showPage("login-page");
// });
// src/app.ts
import { showLoginPage } from "./login/login";
import { showSignupPage } from "./login/signup";
import { showForgotPage } from "./login/forgot_pass";
import { showDashboard } from "./dashboard/dashboard"; // your dashboard module
import { showchangePassPage } from "./login/change_pass";

export function navigate(page: "login" | "signup" | "forgot" | "dashboard" | "change") {
  switch (page) {
    case "login": showLoginPage(); break;
    case "signup": showSignupPage(); break;
    case "forgot": showForgotPage(); break;
    case "dashboard": showDashboard(); break;
    case "change" : showchangePassPage() ; break;
  }
}

// initial boot
window.addEventListener("DOMContentLoaded", () => {
  navigate("login");
});

