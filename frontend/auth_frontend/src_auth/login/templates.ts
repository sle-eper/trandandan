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
<div class="h-full w-full flex flex-col items-center px-4 py-4 md:py-6 overflow-hidden">

  <!-- Title -->
  <h1 class="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-12 flex items-center gap-3">
    <span class="material-symbols-outlined text-4xl md:text-5xl text-yellow-500">
      gamepad
    </span>
    games
  </h1>

  <!-- Games container -->
  <div class="flex flex-col md:flex-row gap-4 md:gap-8 w-full max-w-4xl flex-1">

    <!-- Ping Pong -->
    <a href="/game/pong" data-route
      class="group relative w-full h-36 sm:h-44 md:h-96 rounded-3xl overflow-hidden cursor-pointer
            transition duration-300 hover:scale-[1.02]
            ring-2 ring-transparent hover:ring-red-500">

      <img src="${startPingPong}"
        alt="Ping Pong Game Background"
        class="absolute inset-0 w-full h-full object-cover" />

      <div class="absolute inset-0 bg-gradient-to-br from-red-950/70 to-black/70"></div>

      <div class="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
        <div class="bg-red-600/20 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full mb-3 md:mb-4
                    transition group-hover:bg-red-500/30">
          <span class="material-symbols-outlined text-4xl md:text-6xl text-white">
            sports_tennis
          </span>
        </div>

        <h2 class="text-xl md:text-3xl font-bold text-white uppercase">
          Ping Pong
        </h2>

        <p class="text-red-200 mt-1 md:mt-2 opacity-0 group-hover:opacity-100 transition duration-500">
          Classic Table Tennis
        </p>
      </div>
    </a>

    <!-- Spy Game -->
    <a href="/game/spy" data-route
      class="group relative w-full h-36 sm:h-44 md:h-96 rounded-3xl overflow-hidden cursor-pointer
             transition duration-300 hover:scale-[1.02]
             ring-2 ring-transparent hover:ring-red-500">

      <img src="${startSpay}"
        alt="Spy Game Background"
        class="absolute inset-0 w-full h-full object-cover" />

      <div class="absolute inset-0 bg-gradient-to-br from-red-950/70 to-black/70"></div>

      <div class="absolute inset-0 flex flex-col justify-center items-center p-4 text-center">
        <div class="bg-red-600/20 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full mb-3 md:mb-4
                    transition group-hover:bg-red-500/30">
          <span class="material-symbols-outlined text-4xl md:text-6xl text-white">
            visibility_off
          </span>
        </div>

        <h2 class="text-xl md:text-3xl font-bold text-white uppercase">
          Spy Game
        </h2>

        <p class="text-red-200 mt-1 md:mt-2 opacity-0 group-hover:opacity-100 transition duration-500 font-semibold">
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

export interface MatchData {
  id: number;
  user1_id: number;
  user2_id: number;
  user1_score: number;
  user2_score: number;
  winner_id: number;
  played_at: string;
  duration?: number;
}

export interface DashboardData {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  avgScore: number;
  matches: MatchData[];
  userId: number;
  currentStreak: number;
  bestStreak: number;
  totalPointsScored: number;
  totalPointsConceded: number;
  avgMatchDuration: number;
}

export function homeTemplate(data: DashboardData): string {
  const pointDiff = data.totalPointsScored - data.totalPointsConceded;
  const pointDiffColor = pointDiff >= 0 ? 'text-green-400' : 'text-red-400';
  const pointDiffSign = pointDiff >= 0 ? '+' : '';

  return `
  <div class="w-full h-full flex flex-col gap-4 overflow-hidden">

    <!-- HEADER -->
    <div class="flex items-center justify-between px-4 pt-3">
      <div>
        <h1 class="text-2xl font-bold text-white">Gaming Dashboard</h1>
        <p class="text-sm text-gray-400">Track your performance and match history</p>
      </div>
    </div>

    <!-- TOP STATS -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-4">
      ${statCard("Total Matches", data.totalMatches, "cyan", `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      `)}
      ${statCard("Wins", data.wins, "green", `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
        </svg>
      `)}
      ${statCard("Losses", data.losses, "red", `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      `)}
      ${statCard("Win Rate", data.winRate + "%", "emerald", `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
        </svg>
      `)}
      ${statCard("Avg Score", data.avgScore.toFixed(1), "amber", `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      `)}
      ${statCard("Win Streak", `${data.currentStreak}`, "violet", `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      `, `Best: ${data.bestStreak}`)}
    </div>

    <!-- CHARTS ROW -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4">
      
      <!-- PERFORMANCE OVER TIME -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col">
        <h2 class="text-sm font-semibold text-gray-300 mb-3">Performance Over Time</h2>
        <div class="flex-1 flex items-center justify-center min-h-[160px]">
          <canvas id="performanceLineChart" width="320" height="160"></canvas>
        </div>
      </div>

      <!-- WIN/LOSS PIE -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col">
        <h2 class="text-sm font-semibold text-gray-300 mb-3">Win / Loss Ratio</h2>
        <div class="flex-1 flex items-center justify-center gap-6">
          <canvas id="performanceChart" width="140" height="140"></canvas>
          <div class="flex flex-col gap-3 text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="text-gray-300">Wins <strong class="text-white ml-1">${data.winRate}%</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="text-gray-300">Losses <strong class="text-white ml-1">${100 - data.winRate}%</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- SCORE DISTRIBUTION -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col">
        <h2 class="text-sm font-semibold text-gray-300 mb-3">Score Distribution</h2>
        <div class="flex-1 flex items-center justify-center min-h-[160px]">
          <canvas id="scoreDistChart" width="320" height="160"></canvas>
        </div>
      </div>
    </div>

    <!-- BOTTOM SECTION -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0 px-4 pb-4">

      <!-- ADDITIONAL STATS -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col gap-3 min-h-0">
        <h2 class="text-sm font-semibold text-gray-300">Detailed Statistics</h2>
        
        <div class="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
          ${detailStatRow("Points Scored", data.totalPointsScored, "text-emerald-400")}
          ${detailStatRow("Points Conceded", data.totalPointsConceded, "text-red-400")}
          ${detailStatRow("Point Differential", `${pointDiffSign}${pointDiff}`, pointDiffColor)}
          ${detailStatRow("Avg Match Duration", `${data.avgMatchDuration}s`, "text-cyan-400")}
          ${detailStatRow("Games This Week", getGamesThisWeek(data.matches), "text-amber-400")}
        </div>

        <!-- Mini progress bars -->
        <div class="mt-2 pt-3 border-t border-white/10">
          <div class="text-xs text-gray-400 mb-2">Win Rate Progress</div>
          <div class="h-2 bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" style="width: ${data.winRate}%"></div>
          </div>
        </div>
      </div>

      <!-- MATCH HISTORY -->
      <div class="lg:col-span-2 bg-black/40 rounded-2xl border border-white/10 p-4 flex flex-col min-h-0">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-semibold text-gray-300">Recent Matches</h2>
          <span class="text-xs text-gray-500">${data.matches.length} matches</span>
        </div>

        <div id="matches-container" class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          ${data.matches.length === 0
            ? `<div class="flex flex-col items-center justify-center h-full text-gray-500">
                <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                <p class="text-sm">No matches played yet</p>
              </div>`
            : data.matches.map((match, index) => matchCard(match, data.userId, index)).join("")
          }
        </div>
      </div>
    </div>

    <!-- MATCH DETAIL MODAL -->
    <div id="match-detail-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div id="match-detail-content" class="bg-[#1a1a1d] rounded-2xl border border-white/10 p-6 max-w-md w-full mx-4 shadow-2xl">
      </div>
    </div>
  </div>

  <style>
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.15);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.25);
    }
    .match-card {
      transition: all 0.2s ease;
    }
    .match-card:hover {
      transform: translateX(4px);
    }
  </style>
  `;
}

function statCard(label: string, value: string | number, color: string, icon: string, subtitle?: string): string {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  };

  const c = colorMap[color] || colorMap.cyan;

  return `
    <div class="${c.bg} ${c.border} border rounded-xl p-3 hover:border-opacity-60 transition">
      <div class="flex items-center gap-2 mb-1">
        <span class="${c.text}">${icon}</span>
        <span class="text-xs text-gray-400">${label}</span>
      </div>
      <div class="text-xl font-bold text-white">${value}</div>
      ${subtitle ? `<div class="text-xs text-gray-500 mt-0.5">${subtitle}</div>` : ''}
    </div>
  `;
}

function detailStatRow(label: string, value: string | number, valueColor: string): string {
  return `
    <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span class="text-sm text-gray-400">${label}</span>
      <span class="text-sm font-semibold ${valueColor}">${value}</span>
    </div>
  `;
}

function matchCard(match: MatchData, userId: number, index: number): string {
  const isWin = match.winner_id === userId;
  const myScore = match.user1_id === userId ? match.user1_score : match.user2_score;
  const oppScore = match.user1_id === userId ? match.user2_score : match.user1_score;
  const oppId = match.user1_id === userId ? match.user2_id : match.user1_id;
  const date = new Date(match.played_at);
  const timeAgo = getTimeAgo(date);

  const bgColor = isWin ? 'bg-emerald-500/5 hover:bg-emerald-500/10' : 'bg-red-500/5 hover:bg-red-500/10';
  const borderColor = isWin ? 'border-emerald-500/20' : 'border-red-500/20';
  const resultColor = isWin ? 'text-emerald-400' : 'text-red-400';
  const resultIcon = isWin 
    ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
    : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`;

  return `
    <div class="match-card p-3 rounded-xl border ${bgColor} ${borderColor} cursor-pointer" 
         data-match-id="${match.id}" 
         data-match-index="${index}"
         onclick="window.showMatchDetail(${index})">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full ${isWin ? 'bg-emerald-500/20' : 'bg-red-500/20'} flex items-center justify-center ${resultColor}">
            ${resultIcon}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-white">${isWin ? 'Victory' : 'Defeat'}</span>
              <span class="text-xs text-gray-500">vs Player ${oppId}</span>
            </div>
            <div class="text-xs text-gray-500">${timeAgo}</div>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-lg font-bold ${isWin ? 'text-emerald-400' : 'text-white'}">${myScore}</span>
          <span class="text-gray-600">-</span>
          <span class="text-lg font-bold ${!isWin ? 'text-red-400' : 'text-white'}">${oppScore}</span>
        </div>
      </div>
    </div>
  `;
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getGamesThisWeek(matches: MatchData[]): number {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return matches.filter(m => new Date(m.played_at) >= oneWeekAgo).length;
}

export function matchDetailTemplate(match: MatchData, userId: number): string {
  const isWin = match.winner_id === userId;
  const myScore = match.user1_id === userId ? match.user1_score : match.user2_score;
  const oppScore = match.user1_id === userId ? match.user2_score : match.user1_score;
  const oppId = match.user1_id === userId ? match.user2_id : match.user1_id;
  const date = new Date(match.played_at);
  const duration = match.duration || Math.floor(Math.random() * 180) + 60;

  const resultColor = isWin ? 'text-emerald-400' : 'text-red-400';
  const resultBg = isWin ? 'bg-emerald-500/10' : 'bg-red-500/10';

  return `
    <div class="text-center mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full ${resultBg} ${resultColor} text-sm font-medium mb-2">
        ${isWin ? 'Victory' : 'Defeat'}
      </div>
      <h3 class="text-xl font-bold text-white">Match vs Player ${oppId}</h3>
      <p class="text-sm text-gray-400">${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    </div>

    <div class="flex items-center justify-center gap-8 mb-6">
      <div class="text-center">
        <div class="text-3xl font-bold ${isWin ? 'text-emerald-400' : 'text-white'}">${myScore}</div>
        <div class="text-xs text-gray-400">Your Score</div>
      </div>
      <div class="text-2xl text-gray-600">-</div>
      <div class="text-center">
        <div class="text-3xl font-bold ${!isWin ? 'text-red-400' : 'text-white'}">${oppScore}</div>
        <div class="text-xs text-gray-400">Opponent</div>
      </div>
    </div>

    <div class="space-y-3 mb-6">
      <div class="flex justify-between items-center py-2 border-b border-white/5">
        <span class="text-sm text-gray-400">Duration</span>
        <span class="text-sm font-medium text-white">${Math.floor(duration / 60)}m ${duration % 60}s</span>
      </div>
      <div class="flex justify-between items-center py-2 border-b border-white/5">
        <span class="text-sm text-gray-400">Point Difference</span>
        <span class="text-sm font-medium ${myScore - oppScore >= 0 ? 'text-emerald-400' : 'text-red-400'}">
          ${myScore - oppScore >= 0 ? '+' : ''}${myScore - oppScore}
        </span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-sm text-gray-400">Performance</span>
        <span class="text-sm font-medium text-amber-400">${getPerformanceRating(myScore, oppScore, isWin)}</span>
      </div>
    </div>

    <button onclick="window.closeMatchDetail()" class="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition text-white text-sm font-medium">
      Close
    </button>
  `;
}

function getPerformanceRating(myScore: number, oppScore: number, isWin: boolean): string {
  const diff = myScore - oppScore;
  if (isWin && diff >= 3) return 'Excellent';
  if (isWin && diff >= 1) return 'Good';
  if (isWin) return 'Close Win';
  if (!isWin && diff >= -1) return 'Close Loss';
  if (!isWin && diff >= -3) return 'Tough Loss';
  return 'Needs Improvement';
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