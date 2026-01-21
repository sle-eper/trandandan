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
function statCard(title: string, value: string | number) {
  return `
    <div class="bg-black/40 rounded-xl border border-white/10 p-5">
      <p class="text-gray-400 text-sm">${title}</p>
      <p class="text-3xl font-bold mt-2">${value}</p>
    </div>
  `;
}


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

type HomeTemplateData = {
  totalMatches: number;
  wins: number;
  winRate: number;
  matches: any[];
  userId: number;
};

export function homeTemplate(data: HomeTemplateData): string {
  return `
  <div class="w-full h-full flex flex-col gap-6">

    <!-- HEADER -->
    <div>
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <p class="text-gray-400 mt-1">Welcome back, Champion!</p>
    </div>

    <!-- STATS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      ${statCard("Total Matches", data.totalMatches)}
      ${statCard("Wins", data.wins)}
      ${statCard("Win Rate", data.winRate + "%")}
      ${statCard("Ranking", "#24")}
    </div>

    <!-- MAIN CONTENT -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-grow">

      <!-- QUICK PLAY -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-6 flex flex-col gap-5">
        <h2 class="text-xl font-semibold">Quick Play</h2>

        <div class="flex flex-col gap-3">
          <button class="bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition">
            Find Match
          </button>

          <button class="border border-white/20 py-3 rounded-lg hover:bg-white/5 transition">
            Challenge Friend
          </button>
        </div>

        <div class="relative my-2">
          <div class="border-t border-white/10"></div>
          <span
            class="absolute left-1/2 -translate-x-1/2 -top-3
                   bg-[#111] px-3 text-xs text-gray-400">
            Competitive
          </span>
        </div>

        <div
          class="bg-black/50 border border-[#E63946]/40 rounded-xl p-4
                 hover:border-[#E63946] transition">
          <h3 class="text-lg font-semibold mb-1">
            Tournament Mode
          </h3>

          <p class="text-sm text-gray-400 mb-3">
            Enter ranked tournaments and prove your skills against top players.
          </p>

          <button
            class="w-full bg-gradient-to-r from-[#E63946] to-[#711F21]
                   hover:opacity-90 py-3 rounded-lg font-semibold transition">
            Play Tournament
          </button>
        </div>
      </div>

      <!-- RECENT MATCHES -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-6">
        <h2 class="text-xl font-semibold mb-4">Recent Matches</h2>

        <div class="space-y-3">
          ${
            data.matches.length === 0
              ? `<p class="text-gray-400 text-sm">No matches played yet</p>`
              : data.matches.map(match => {
                  const isWin = match.winner_id === data.userId;

                  const score =
                    match.user1_id === data.userId
                      ? `${match.user1_score} - ${match.user2_score}`
                      : `${match.user2_score} - ${match.user1_score}`;

                  const opponentId =
                    match.user1_id === data.userId
                      ? match.user2_id
                      : match.user1_id;

                  return matchRow(
                    `Player ${opponentId}`,
                    score,
                    new Date(match.played_at).toLocaleDateString(),
                    isWin
                  );
                }).join("")
          }
        </div>
      </div>

      <!-- FRIENDS -->
      <div class="bg-black/40 rounded-2xl border border-white/10 p-6">
        <h2 class="text-xl font-semibold mb-4">Online Friends</h2>

        <div class="space-y-4">
          ${friendRow("Alex", "Online")}
          ${friendRow("Jordan", "In-Game")}
          ${friendRow("Sam", "Online")}
        </div>
      </div>

    </div>
  </div>
  `;
}


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