import { navigate } from "../../auth_frontend/src_auth/app"

/* =======================
   PAGE TEMPLATES
======================= */

function tournamentEntryTemplate() {
  return `
    <div class="w-full h-full flex flex-col justify-center items-center gap-8">

      <h1 class="text-4xl font-bold">🏆 Tournament</h1>

      <p class="text-gray-400 max-w-md text-center">
        Create or join tournaments and compete with other players.
      </p>

      <div class="flex gap-4">
        <button
          id="create-tournament-btn"
          class="px-6 py-3 bg-red-600 rounded-xl font-semibold hover:opacity-90 transition">
          Create Tournament
        </button>

        <button
          id="view-tournaments-btn"
          class="px-6 py-3 bg-white/10 rounded-xl font-semibold hover:bg-white/20 transition">
          View Tournaments
        </button>
      </div>

    </div>
  `;
}

function tournamentListTemplate() {
  return `
    <div class="w-full h-full flex flex-col gap-6">

      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold">Available Tournaments</h2>

        <button
          id="back-to-entry"
          class="text-sm text-red-400 hover:underline">
          ← Back
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden">

        ${tournamentCard("Ping Pong Masters", "Upcoming")}
        ${tournamentCard("Night Knockout", "Ongoing")}
        ${tournamentCard("Champions Cup", "Finished")}

      </div>

    </div>
  `;
}

function tournamentCard(name: string, status: "Upcoming" | "Ongoing" | "Finished") {
  const statusColor =
    status === "Upcoming"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "Ongoing"
      ? "bg-green-500/20 text-green-400"
      : "bg-gray-500/20 text-gray-400";

  return `
    <div class="rounded-2xl border border-white/10 p-5 flex flex-col justify-between
                bg-gradient-to-br from-[#1a1a1d] to-[#0f0f11]">

      <div>
        <h3 class="text-xl font-semibold mb-2">${name}</h3>
        <span class="text-xs px-3 py-1 rounded-full ${statusColor}">
          ${status}
        </span>
      </div>

      <button
        class="mt-4 w-full py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition text-sm">
        View
      </button>

    </div>
  `;
}

/* =======================
   RENDER + LOGIC
======================= */

export function renderCreateTournament() {
  const main = document.getElementById("dashboard-content");
  if (!main) return;

  main.innerHTML = `
    <div class="w-full h-full flex justify-center items-center">

      <div class="w-full max-w-lg bg-[#0f0f11]
                  border border-white/10
                  rounded-3xl p-8 shadow-xl">

        <!-- Title -->
        <h2 class="text-3xl font-bold text-center mb-2">
          Create Tournament
        </h2>

        <!-- Description -->
        <p class="text-center text-gray-400 text-sm mb-6">
          Single Elimination Tournament
        </p>

        <div class="flex flex-col gap-5">

          <!-- Tournament Name -->
          <div>
            <label class="text-sm text-gray-400">
              Tournament Name
            </label>
            <input
              type="text"
              placeholder="Ping Pong Championship"
              class="w-full mt-1 px-4 py-2 rounded-xl
                     bg-black/40 border border-white/10
                     outline-none focus:border-red-500"/>
          </div>

          <!-- Max Players -->
          <div>
            <label class="text-sm text-gray-400">
              Max Players
            </label>
            <select
              class="w-full mt-1 px-4 py-2 rounded-xl
                     bg-black/40 border border-white/10
                     outline-none focus:border-red-500">
              <option>4</option>
              <option>8</option>
              <option>16</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6">
            <button
              class="flex-1 py-2 rounded-xl bg-red-600
                     font-semibold hover:opacity-90 transition">
              Create
            </button>

            <button
              id="cancel-create-tournament"
              class="flex-1 py-2 rounded-xl
                     bg-white/10 hover:bg-white/20 transition">
              Cancel
            </button>
          </div>

        </div>
      </div>

    </div>
  `;
}

  export function Tournament() {
    const main = document.getElementById("dashboard-content");
    if (!main) return;

    main.innerHTML = tournamentEntryTemplate();
    attachEntryHandlers();
  }

  function attachEntryHandlers() {
    document.getElementById("view-tournaments-btn")?.addEventListener("click", () => {
      renderTournamentList();
      navigate("/tournement/list");
    });

    document.getElementById("create-tournament-btn")?.addEventListener("click", () => {
      renderCreateTournament();
      navigate("/tournement/create");
      document.getElementById("cancel-create-tournament")?.addEventListener("click", () => {
        navigate("/tournement");
      });

    });
  }
  export function renderTournamentList() {
    const main = document.getElementById("dashboard-content");
    if (!main) return;
    
    main.innerHTML = tournamentListTemplate();
    attachListHandlers();
    
  }

  function attachListHandlers() {
    document.getElementById("back-to-entry")?.addEventListener("click", () => {
      Tournament();
      navigate("/tournement");
    });
  }
