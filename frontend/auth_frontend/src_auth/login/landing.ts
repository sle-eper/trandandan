import { navigate } from "../app";
export function showLandingPage(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;

  app.innerHTML = `
  <div class="h-screen w-screen overflow-hidden bg-black text-white flex flex-col">

  <!-- NAVBAR -->
  <nav class="flex-shrink-0 w-full flex justify-between items-center px-8 py-5 border-b border-white/10">
    <div class="flex items-center gap-2">
      <div class="px-2 py-1 rounded-lg">
      <img src="/src_auth/images/pingponglogo.jpg" alt="logo" class="w-12 h-12 rounded-lg"/>
      </div>
      <span class="text-xl font-bold">Ping Pong</span>
    </div>

    <button id="get-started"
      class="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-semibold">
      Get Started
    </button>
  </nav>

  <!-- MAIN -->
  <main class="flex-1 flex items-center justify-between px-10 lg:px-24">

    <!-- LEFT -->
    <div class="max-w-xl">
      <h1 class="text-6xl lg:text-7xl font-extrabold leading-tight">
        The Ultimate <br />
        <span class="text-red-600">Pong</span> <br/>
        Experience
      </h1>

      <p class="mt-6 text-lg text-gray-300">
        Challenge players in real-time matches.
        Climb the ranks, chat with friends, and become the
        ultimate ping pong champion.
      </p>

      <button id="play"
        class="mt-8 bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-semibold"> Play Now </button>
    </div>

    <!-- RIGHT -->
    <div class="flex items-center justify-center">
      <video src="src_auth/images/vedio14.mp4"
      autoplay
      muted
      loop
      playsinline
      class="h-[90vh] max-w-[55vw] object-contain
            [mask-image:radial-gradient(circle,white_30%,transparent_100%)]"
    ></video>
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
