import { navigate } from "../app";
export function showLandingPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
    <div class="min-h-screen bg-gradient-to-br from-black to-neutral-900 text-white">

      <!-- NAVBAR -->
      <nav class="w-full flex justify-between items-center px-8 py-5 border-b border-white/10">
        <div class="flex items-center gap-2">
          <div class="bg-black-600 px-2 py-1 rounded-lg">🏓</div>
          <span class="text-xl font-bold">Ping Pong</span>
        </div>

        <div class="flex items-center gap-5">
            <button id="get-started" class="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-semibold">
            Get Started
          </button>
        </div>
      </nav>

      <!-- MAIN -->
      <main class="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-24 py-20 gap-10">

        <!-- LEFT -->
        <div class="max-w-xl">
          <h1 class="text-6xl lg:text-7xl font-extrabold leading-tight">
            The Ultimate <br />
            <span class="text-red-600">Pong</span> <br />
            Experience
          </h1>

          <p class="mt-6 text-lg text-gray-300">
            Challenge players in real-time matches.
            Climb the ranks, chat with friends, and become the
            ultimate ping pong champion.
          </p>

          <div class="flex gap-4 mt-8">
            <button id = "play" class="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              ⚡ Play Now
            </button>
          </div>
        </div>

        <!-- RIGHT IMAGE -->
        <div class="flex justify-center">
<img
  src="/src_auth/images/gogo1.jpg"
  class="w-[450px] rounded-xl border-none outline-none
  [mask-image:radial-gradient(circle,white_20%,transparent_100%)]
  shadow-none"
/>



        </div>
      </main>
    </div>
  `;

  // Allow navigation to login page
  const play = document.getElementById("play");
  if (play) {
    play.addEventListener("click", () => {
        navigate("/login");
    });
  }
  const getStarted = document.getElementById("get-started");
  if(getStarted)
  {
    getStarted.addEventListener("click", () => {
        navigate("/login");
    }
    );
  }
}
