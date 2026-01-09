import { navigate } from "../../auth_frontend/src_auth/app"

/* =======================
   TOURNAMENT STATE
======================= */
let currentTournament = {
  name: "",
  maxPlayers: 16
};

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
    <div class="w-full h-full flex flex-col gap-6 p-6">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold">Available Tournaments</h2>
        <button
          id="back-to-entry"
          class="text-sm text-red-400 hover:underline">
          ← Back
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        ${tournamentCard("Ping Pong Masters", "Upcoming", "ping-pong-masters", 16)}
        ${tournamentCard("Night Knockout", "Ongoing", "night-knockout", 8)}
        ${tournamentCard("Champions Cup", "Finished", "champions-cup", 4)}
      </div>
    </div>
  `;
}

function tournamentCard(name: string, status: "Upcoming" | "Ongoing" | "Finished", id: string, maxPlayers: number) {
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
        <div class="flex gap-2 items-center">
          <span class="text-xs px-3 py-1 rounded-full ${statusColor}">
            ${status}
          </span>
          <span class="text-xs text-gray-500">${maxPlayers} Players</span>
        </div>
      </div>
      <button
        class="mt-4 w-full py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition text-sm view-bracket-btn"
        data-tournament-name="${name}"
        data-max-players="${maxPlayers}">
        View Bracket
      </button>
    </div>
  `;
}

function generateBracketHTML(maxPlayers: number) {
  if (maxPlayers === 4) {
    return generate4PlayerBracket();
  } else if (maxPlayers === 8) {
    return generate8PlayerBracket();
  } else {
    return generate16PlayerBracket();
  }
}

function generate4PlayerBracket() {
  return `
    <div class="w-full h-full flex items-center justify-center gap-12">
      
      <!-- Semi-Finals -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Semi-Final</h3>
        <div class="flex flex-col gap-24">
          ${matchCard("Player 1", "TBD", "Player 2", "TBD")}
          ${matchCard("Player 3", "TBD", "Player 4", "TBD")}
        </div>
      </div>

      <!-- Connector Lines SF → F -->
      <div class="flex flex-col justify-center">
        <svg width="60" height="280" class="text-white/20">
          ${connectorPair(60, 96, 48, 3)}
        </svg>
      </div>

      <!-- Final -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Final</h3>
        <div class="flex flex-col justify-center h-full">
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
        </div>
      </div>

    </div>
  `;
}

function generate8PlayerBracket() {
  return `
    <div class="w-full h-full flex items-center justify-center gap-10">
      
      <!-- Quarter-Finals -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Quarter-Final</h3>
        <div class="flex flex-col gap-14">
          ${matchCard("Player 1", "TBD", "Player 2", "TBD")}
          ${matchCard("Player 3", "TBD", "Player 4", "TBD")}
          ${matchCard("Player 5", "TBD", "Player 6", "TBD")}
          ${matchCard("Player 7", "TBD", "Player 8", "TBD")}
        </div>
      </div>

      <!-- Connector Lines QF → SF -->
      <div class="flex flex-col justify-center">
        <svg width="60" height="480" class="text-white/20">
          ${connectorPair(60, 70, 48, 2)}
          ${connectorPair(60, 70, 308, 2)}
        </svg>
      </div>

      <!-- Semi-Finals -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Semi-Final</h3>
        <div class="flex flex-col gap-32">
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
        </div>
      </div>

      <!-- Connector Lines SF → F -->
      <div class="flex flex-col justify-center">
        <svg width="60" height="320" class="text-white/20">
          ${connectorPair(60, 128, 48, 3)}
        </svg>
      </div>

      <!-- Final -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Final</h3>
        <div class="flex flex-col justify-center h-full">
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
        </div>
      </div>

    </div>
  `;
}

function generate16PlayerBracket() {
  return `
    <div class="w-full h-full flex items-center justify-center gap-8">
      
      <!-- Round of 16 -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Round of 16</h3>
        <div class="flex flex-col gap-20">
          ${matchCard("Player 1", "3", "Player 2", "1")}
          ${matchCard("Player 3", "TBD", "Player 4", "TBD")}
          ${matchCard("Player 5", "TBD", "Player 6", "TBD")}
          ${matchCard("Player 7", "TBD", "Player 8", "TBD")}
          ${matchCard("Player 9", "TBD", "Player 10", "TBD")}
          ${matchCard("Player 11", "TBD", "Player 12", "TBD")}
          ${matchCard("Player 13", "TBD", "Player 14", "TBD")}
          ${matchCard("Player 15", "TBD", "Player 16", "TBD")}
        </div>
      </div>

      <!-- Connector Lines R16 → QF -->
      <div class="flex flex-col justify-center">
        <svg width="50" height="960" class="text-white/20">
          ${connectorPair(50, 160, 48, 2)}
          ${connectorPair(50, 160, 328, 2)}
          ${connectorPair(50, 160, 608, 2)}
          ${connectorPair(50, 160, 888, 2)}
        </svg>
      </div>

      <!-- Quarter-Finals -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Quarter-Final</h3>
        <div class="flex flex-col gap-32">
          ${matchCard("Player 1", "TBD", "TBD", "TBD")}
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
        </div>
      </div>

      <!-- Connector Lines QF → SF -->
      <div class="flex flex-col justify-center">
        <svg width="50" height="680" class="text-white/20">
          ${connectorPair(50, 240, 48, 2.5)}
          ${connectorPair(50, 240, 504, 2.5)}
        </svg>
      </div>

      <!-- Semi-Finals -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Semi-Final</h3>
        <div class="flex flex-col gap-56">
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
        </div>
      </div>

      <!-- Connector Lines SF → F -->
      <div class="flex flex-col justify-center">
        <svg width="50" height="500" class="text-white/20">
          ${connectorPair(50, 320, 48, 3)}
        </svg>
      </div>

      <!-- Final -->
      <div class="flex flex-col gap-2">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider mb-4 text-center">Final</h3>
        <div class="flex flex-col justify-center h-full">
          ${matchCard("TBD", "TBD", "TBD", "TBD")}
        </div>
      </div>

    </div>
  `;
}

function tournamentBracketTemplate() {
  return `
    <div class="w-full h-full flex flex-col">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 class="text-2xl font-bold">${currentTournament.name}</h2>
          <p class="text-xs text-gray-400 mt-1">Single Elimination • ${currentTournament.maxPlayers} Players</p>
        </div>
        <button
          id="back-to-tournaments"
          class="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition">
          ← Back
        </button>
      </div>

      <!-- Bracket Container (No Scroll) -->
      <div class="flex-1 flex items-center justify-center p-4">
        ${generateBracketHTML(currentTournament.maxPlayers)}
      </div>

    </div>
  `;
}

function matchCard(player1: string, score1: string, player2: string, score2: string) {
  return `
    <div class="w-44 rounded-lg border border-white/20 bg-gradient-to-br from-[#1a1a1d] to-[#0f0f11] overflow-hidden shadow-lg">
      <div class="flex items-center justify-between px-3 py-2 border-b border-white/10 hover:bg-white/5 transition">
        <span class="text-sm text-white truncate flex-1">${player1}</span>
        <span class="text-xs text-gray-400 font-mono ml-2">${score1}</span>
      </div>
      <div class="flex items-center justify-between px-3 py-2 hover:bg-white/5 transition">
        <span class="text-sm text-white truncate flex-1">${player2}</span>
        <span class="text-xs text-gray-400 font-mono ml-2">${score2}</span>
      </div>
    </div>
  `;
}

function connectorPair(width: number, height: number, yOffset: number, strokeWidth: number = 1.5) {
  const cardHeight = 56;
  const cardMidpoint = cardHeight / 2;
  
  const topMatchY = yOffset + cardMidpoint;
  const bottomMatchY = yOffset + height + cardMidpoint;
  const midY = (topMatchY + bottomMatchY) / 2;
  
  return `
    <line x1="0" y1="${topMatchY}" x2="20" y2="${topMatchY}" stroke="currentColor" stroke-width="${strokeWidth}"/>
    <line x1="20" y1="${topMatchY}" x2="20" y2="${midY}" stroke="currentColor" stroke-width="${strokeWidth}"/>
    <line x1="0" y1="${bottomMatchY}" x2="20" y2="${bottomMatchY}" stroke="currentColor" stroke-width="${strokeWidth}"/>
    <line x1="20" y1="${bottomMatchY}" x2="20" y2="${midY}" stroke="currentColor" stroke-width="${strokeWidth}"/>
    <line x1="20" y1="${midY}" x2="${width}" y2="${midY}" stroke="currentColor" stroke-width="${strokeWidth}"/>
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
        <h2 class="text-3xl font-bold text-center mb-2">
          Create Tournament
        </h2>
        <p class="text-center text-gray-400 text-sm mb-6">
          Single Elimination Tournament
        </p>
        <div class="flex flex-col gap-5">
          <div>
            <label class="text-sm text-gray-400">
              Tournament Name
            </label>
            <input
              id="tournament-name-input"
              type="text"
              placeholder="Ping Pong Championship"
              class="w-full mt-1 px-4 py-2 rounded-xl
                     bg-black/40 border border-white/10
                     outline-none focus:border-red-500"/>
          </div>
          <div>
            <label class="text-sm text-gray-400">
              Max Players
            </label>
            <select
              id="max-players-select"
              class="w-full mt-1 px-4 py-2 rounded-xl
                     bg-black/40 border border-white/10
                     outline-none focus:border-red-500">
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16" selected>16</option>
            </select>
          </div>
          <div class="flex gap-3 mt-6">
            <button id="create"
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
  
  document.getElementById("cancel-create-tournament")?.addEventListener("click", () => {
    navigate("/tournement");
    Tournament();
  });
  
  document.getElementById("create")?.addEventListener("click", () => {
    const nameInput = document.getElementById("tournament-name-input") as HTMLInputElement;
    const playersSelect = document.getElementById("max-players-select") as HTMLSelectElement;
    
    currentTournament.name = nameInput.value || "New Tournament";
    currentTournament.maxPlayers = parseInt(playersSelect.value);
    
    renderTournamentBracket();
    navigate("/tournement/bracket");
  });
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

  document.querySelectorAll(".view-bracket-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      currentTournament.name = target.dataset.tournamentName || "Tournament";
      currentTournament.maxPlayers = parseInt(target.dataset.maxPlayers || "16");
      
      renderTournamentBracket();
      navigate("/tournement/bracket");
    });
  });
}

export function renderTournamentBracket() {
  const main = document.getElementById("dashboard-content");
  if (!main) return;
  main.innerHTML = tournamentBracketTemplate();
  
  document.getElementById("back-to-tournaments")?.addEventListener("click", () => {
    renderTournamentList();
    navigate("/tournement/list");
  });
}