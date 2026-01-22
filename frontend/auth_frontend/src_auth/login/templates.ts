// templates.ts
import image1 from "../images/pingpong1.jpg?inline"
import image2 from "../images/pingpong2.jpg?inline"
import image3 from "../images/pingpong3.jpg?inline"
import startSpay  from "../images/startSpay.png?inline";
import startPingPong  from "../images/startPingpong.png?inline";
export const loginTemplate = () => `
  <form id="login-form"
    class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:w-[320px] flex flex-col justify-between mb-10 md:mb-0">

    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-2">Login</h2>
      <p class="text-gray-400 mb-6 text-sm md:text-base">Glad you're back!</p>

      <div class="space-y-4">
        <input id="login-username" type="text" placeholder="Username"  autocomplete="username"
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />

        <div class="relative">
          <input id="login-password" type="password" placeholder="Password" autocomplete="current-password"
            class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249] pr-10" />

          <span id="toggle-password"
            class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 
            cursor-pointer text-gray-400 hover:text-white">
            visibility
          </span>
        </div>

        <div id="login-error"
          class="text-red-500 text-sm h-5 opacity-0 transition-opacity duration-300"></div>
      </div>

      <div class="flex items-center mt-3">
        <input id="login-remember" type="checkbox" class="mr-2 accent-[#E64249]" />
        <label for="login-remember" class="text-gray-300 text-sm">Remember me</label>
      </div>

      <!-- 🔑 type="submit" -->
      <button id="login-btn" type="submit"
        class="w-full bg-red-600 text-white py-2 rounded-md mt-4 hover:opacity-90 transition">
        Login
      </button>

      <p id="login-forgot" class="text-center text-gray-400 text-sm mt-3 cursor-pointer hover:text-white">
        Forgot password?
      </p>

      <div class="flex items-center my-6">
        <hr class="flex-grow border-gray-700" />
        <span class="text-gray-500 text-sm mx-3">or</span>
        <hr class="flex-grow border-gray-700" />
      </div>

      <div class="flex items-center justify-center gap-6">
        <button type="button" id="login-google"
          class="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="Google" class="w-9 h-9" />
        </button>

        <button type="button" id="login-github"
          class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            alt="GitHub" class="w-9 h-9 invert" />
        </button>
      </div>
    </div>

    <p class="text-center text-gray-400 text-sm mt-6">
      Don't have an account?
      <span id="login-signup" class="text-[#E64249] cursor-pointer hover:underline">Sign up</span>
    </p>
  </form>
`;

export const signupTemplate = () => `
  <div id="signup-page" class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:w-[320px] flex flex-col justify-between mb-10 md:mb-0">

    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-4">Sign Up</h2>

      <div class="space-y-4">
        <input id="signup-username" type="text" placeholder="Username"
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />

        <input id="signup-email" type="email" placeholder="Email"
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />

        <!-- PASSWORD -->
        <div class="relative">
          <input id="signup-password" type="password" placeholder="Password"
            class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249] pr-10" />
          <span id="toggle-signup-password"
            class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2
            cursor-pointer text-gray-400 hover:text-white">
            visibility
          </span>
        </div>

        <!-- CONFIRM PASSWORD -->
        <div class="relative">
          <input id="signup-confirm" type="password" placeholder="Confirm Password"
            class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249] pr-10" />
          <span id="toggle-signup-confirm"
            class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2
            cursor-pointer text-gray-400 hover:text-white">
            visibility
          </span>
        </div>
      </div>
        <div id="signup-error"
        class="text-red-500 text-sm h-5 opacity-0 transition-opacity duration-300 mt-2">
      </div>


      <button id="signup-btn"
        class="w-full bg-red-600 text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
        Sign Up
      </button>
    </div>

    <p class="text-center text-gray-400 text-sm mt-6">
      Already have an account?
      <span id="signup-login" class="text-[#E64249] cursor-pointer hover:underline">Login</span>
    </p>
  </div>
`;
export const gamesTemplate = () => `
<div class="min-h-screen w-full flex flex-col justify-center items-center p-6">

  <h1 class="text-4xl md:text-5xl font-bold text-white mb-12 flex items-center gap-4">
    <span class="material-symbols-outlined text-5xl text-yellow-500">gamepad</span>
    Choose a game
  </h1>

  <div class="flex flex-col md:flex-row gap-8 w-full max-w-4xl">

    <!-- Ping Pong -->
    <a href="/game/pong" data-route
      class="group relative w-full h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer
            duration-300 hover:scale-[1.02] ring-2 ring-transparent hover:ring-red-500">
      
      <img src="${startPingPong}" 
          alt="Spy Game Background" 
          class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-br from-red-950/70 to-black/70 z-0"></div>

      <div class="absolute inset-0 flex flex-col justify-center items-center z-10 p-4">
        <div class="bg-red-600/20 w-20 h-20 flex items-center justify-center rounded-full mb-4 group-hover:bg-red-500/30">
          <span class="material-symbols-outlined text-6xl text-white">sports_tennis</span>
        </div>
        <h2 class="text-3xl font-bold text-white uppercase">Ping Pong</h2>
        <p class="text-red-200 mt-2 opacity-0 group-hover:opacity-100 duration-500">
          Classic Table Tennis
        </p>
      </div>
    </a>

    <!-- Spy Game -->
    <a href="/game/spy" data-route
      class="group relative w-full h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer
              duration-300 hover:scale-[1.02] ring-2 ring-transparent hover:ring-red-500">

      <img src="${startSpay}" 
          alt="Spy Game Background" 
          class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-br from-red-950/70 to-black/70 z-0"></div>


      <div class="absolute inset-0 flex flex-col justify-center items-center z-10 p-4">
        <div class="bg-red-600/20 w-20 h-20 flex items-center justify-center rounded-full mb-4 group-hover:bg-red-500/30">
          <span class="material-symbols-outlined text-6xl text-white">visibility_off</span>
        </div>
        <h2 class="text-3xl font-bold text-white uppercaseDrop-shadow-lg">Spy Game</h2>
        <p class="text-red-200 mt-2 opacity-0 group-hover:opacity-100 duration-500 font-semibold">
          Find the Imposter
        </p>
      </div>
</a>

  </div>
</div>
`;


export const forgotTemplate = () => `
  <div id="forgot-page" class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm h-auto md:h-[550px] flex flex-col justify-between mb-10 md:mb-0">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-2">Forgot Password?</h2>
      <div class="space-y-4 mt-6">
        <input id="forgot-email" type="email" placeholder="Email" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
      </div>
      <button id="forgot-btn" class="w-full bg-red-600 text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
        Reset Password
      </button>
    </div>
    <p class="text-center text-gray-400 text-sm mt-6">
      Don’t have an account?
      <span id="forgot-signup" class="text-[#E64249] cursor-pointer hover:underline">Sign up</span>
    </p>
  </div>
`;
export const ChangePass = () => `
<div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:h-[550px] md:w-[320px] mb-10 md:mb-0">

      <div>
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Change Password</h2>

        <div class="space-y-4">
          <input id="change-pass" type="password" placeholder="Password" 
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />

          <input id="change-confirm" type="password" placeholder="Confirm Password" 
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
        </div>

        <button id="change-btn" 
        class="w-full bg-red-600 
        text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
          Change Password
        </button>
      </div>

      <p id="change-back" class="text-center text-gray-400 text-sm mt-6 cursor-pointer hover:text-white">
        Back to Login
      </p>
    </div>
`;

export const mailsended = () => `
<div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:h-[550px] md:w-[320px] mb-10 md:mb-0 flex flex-col justify-center text-center">  
      <div>
        <button id="change-btn" 
        class="w-full bg-red-600 
        text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
          email sent
        </button>
      </div>

      
    </div>
`;
export const verifyTemplate = () => `
  <div id="verify-page"
    class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm mx-auto flex flex-col justify-between">

    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-2 text-center">
        Verify Email
      </h2>

      <p class="text-gray-400 mb-6 text-sm md:text-base text-center">
        We sent a 6-digit code to your email
      </p>

      <!-- CODE INPUTS -->
      <div class="flex justify-between gap-2 mb-4">
        ${Array.from({ length: 6 })
    .map(
      (_, i) => `
          <input
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="verify-input w-10 h-12 text-center text-xl bg-transparent rounded-lg
            border border-gray-700 focus:border-[#E64249] outline-none"
          />
        `
    )
    .join("")}
      </div>

      <!-- ERROR MESSAGE -->
      <div id="verify-error"
        class="text-red-500 text-sm h-5 opacity-0 transition-opacity duration-300 mb-2 text-center">
      </div>

      <button id="verify-btn"
        class="w-full bg-red-600 text-white py-2 rounded-md mt-4 hover:opacity-90 transition">
        Verify
      </button>

      <p class="text-center text-gray-400 text-sm mt-4">
        Didn’t receive the code?
        <span class="text-[#E64249] cursor-pointer hover:underline">
          Resend
        </span>
      </p>
    </div>
  </div>
`;
// function statCard(title: string, value: string | number) {
//   return `
//     <div class="bg-black/40 rounded-xl border border-white/10 p-5">
//       <p class="text-gray-400 text-sm">${title}</p>
//       <p class="text-3xl font-bold mt-2">${value}</p>
//     </div>
//   `;
// }


function matchRow(name: string, score: string, time: string, win: boolean) {
  return `
    <div class="flex items-center justify-between p-3 rounded-lg bg-black/30">
      <div class="flex items-center gap-3">
        <span class="w-2 h-2 rounded-full ${win ? "bg-green-500" : "bg-red-500"}"></span>
        <span>${name}</span>
      </div>
      <div class="text-right text-sm text-gray-400">
        <p>${score}</p>
        <p>${time}</p>
      </div>
    </div>
  `;
}

function friendRow(name: string, status: string) {
  return `
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">${name}</p>
        <p class="text-gray-400 text-sm">${status}</p>
      </div>
      <button class="text-sm px-3 py-1 rounded-md border border-white/20 hover:bg-white/10">
        Invite
      </button>
    </div>
  `;
}

// type HomeTemplateData = {
//   totalMatches: number;
//   wins: number;
//   winRate: number;
//   matches: any[];
//   userId: number;
// };

export function homeTemplate(data: {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  avgScore: number;
  highScore: number;
  currentStreak: number;
  longestStreak: number;
  recentForm: string;
  matches: any[];
  userId: number;
}): string {
  return `
  <div class="w-full h-full flex flex-col gap-2 overflow-hidden">
    
    <!-- HEADER SECTION -->
    <div class="flex-shrink-0">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Gaming Dashboard
      </h1>
    </div>

    <!-- KEY METRICS -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 flex-shrink-0">
      ${statCard("Total Matches", data.totalMatches, "", "blue")}
      ${statCard("Wins", data.wins, "", "green")}
      ${statCard("Losses", data.losses, "", "red")}
      ${statCard("Win Rate", data.winRate + "%", "", "purple")}
      ${statCard("Avg Score", data.avgScore, "", "yellow")}
    </div>

    <!-- MAIN CONTENT GRID -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3 flex-1 min-h-0 overflow-hidden">

      
      <!-- LEFT COLUMN: Performance Charts -->
      <div class="flex flex-col gap-3 min-h-0 overflow-hidden">
        
        <!-- Win/Loss Pie Chart -->
        <div class="bg-black/40 rounded-xl border border-white/10 p-2 backdrop-blur-sm flex-shrink-0">
          <h3 class="text-sm font-semibold mb-1">
            Win/Loss Distribution
          </h3>
          <div class="flex justify-center items-center">
            <canvas id="performanceChart" width="220" height="180"></canvas>
          </div>
          <div class="flex justify-center gap-4 mt-1 text-xs">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              <span class="text-gray-300">Wins: ${data.wins}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              <span class="text-gray-300">Losses: ${data.losses}</span>
            </div>
          </div>
        </div>
      <!-- MIDDLE COLUMN: Match History & Win/Loss Pattern -->
      <div class="xl:col-span-2 flex flex-col gap-3 min-h-0 overflow-hidden">
        
        <!-- Recent Match History -->
        <div class="bg-black/40 rounded-xl border border-white/10 p-3 backdrop-blur-sm flex flex-col min-h-0 flex-1 overflow-hidden">
          <h3 class="text-sm font-semibold mb-2 flex-shrink-0">
            Detailed Match History
          </h3>
          
          <div class="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
            ${
              data.matches.length === 0
                ? `<div class="text-center py-8">
                    <p class="text-gray-400 text-lg mb-2">No matches played yet</p>
                    <p class="text-gray-500 text-sm">Start playing to see your statistics!</p>
                   </div>`
                : data.matches.map(match => {
                    const isWin = match.winner_id === data.userId;
                    const myScore = match.user1_id === data.userId ? match.user1_score : match.user2_score;
                    const opponentScore = match.user1_id === data.userId ? match.user2_score : match.user1_score;
                    const opponent = match.user1_id === data.userId ? match.user2_id : match.user1_id;
                    const date = new Date(match.played_at);
                    const scoreDiff = Math.abs(myScore - opponentScore);

                    return `
                      <div class="p-3 rounded-lg transition-all duration-200 hover:scale-[1.01]
                        ${isWin 
                          ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20' 
                          : 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'}">
                        
                        <div class="flex items-center justify-between mb-2">
                          <div class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                              ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                              ${isWin ? '✓' : '✗'}
                            </div>
                            <div>
                              <div class="font-semibold text-sm ${isWin ? 'text-green-400' : 'text-red-400'}">
                                ${isWin ? 'Victory' : 'Defeat'}
                              </div>
                              <div class="text-xs text-gray-500">
                                vs Player ${opponent}
                              </div>
                            </div>
                          </div>
                          
                          <div class="text-right">
                            <div class="text-xl font-bold">
                              <span class="${isWin ? 'text-green-400' : 'text-white'}">${myScore}</span>
                              <span class="text-gray-600 mx-1">:</span>
                              <span class="${!isWin ? 'text-red-400' : 'text-white'}">${opponentScore}</span>
                            </div>
                            <div class="text-xs text-gray-500">
                              ${isWin ? '+' : '-'}${scoreDiff} pts
                            </div>
                          </div>
                        </div>

                        <div class="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-white/5">
                          <span>${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                          <span class="px-2 py-1 rounded text-xs ${myScore > opponentScore * 1.5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}">
                            ${myScore > opponentScore * 1.5 ? 'Dominant' : scoreDiff <= 2 ? 'Close Match' : 'Standard'}
                          </span>
                        </div>
                      </div>
                    `;
                  }).join("")
            }
          </div>
        </div>
      </div>
    </div>
  </div>

  <style>
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  </style>
  `;
}

function statCard(label: string, value: number | string, icon: string, color: string): string {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    red: 'from-red-500/20 to-red-600/20 border-red-500/30',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  }[color] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';

  return `
    <div class="bg-gradient-to-br ${colorClasses} rounded-lg border p-2 backdrop-blur-sm
      hover:scale-105 transition-transform duration-200 cursor-default">
      <div class="text-xl font-bold mb-0.5">${value}</div>
      <div class="text-xs text-gray-400">${label}</div>
    </div>
  `;
}
// function statCard(label: string, value: number | string, icon: string, color: string): string {
//   const colorClasses = {
//     blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
//     green: 'from-green-500/20 to-green-600/20 border-green-500/30',
//     red: 'from-red-500/20 to-red-600/20 border-red-500/30',
//     purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
//     yellow: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
//     orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
//   }[color] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';

//   return `
//     <div class="bg-gradient-to-br ${colorClasses} rounded-xl border p-4 backdrop-blur-sm
//       hover:scale-105 transition-transform duration-200 cursor-default">
//       <div class="flex items-start justify-between mb-2">
//         <span class="text-2xl">${icon}</span>
//       </div>
//       <div class="text-3xl font-bold mb-1">${value}</div>
//       <div class="text-sm text-gray-400">${label}</div>
//     </div>
//   `;
// }


// src/login/templates.ts
export const images: Record<string, string> = {
  "login-page": image1,
  "signup-page": image2,
  "forgot-page": image3,
  "change-page": image1,
};

export const sharedImage = (pageId: string) => `
  <div class="flex items-center justify-center md:ml-10">
    <img id="page-image"
      src="${images[pageId] || images["login-page"]}"
      alt="Illustration"
      class="w-[80%] md:w-[500px] object-contain rounded-xl hidden sm:block"/>
  </div>
`;