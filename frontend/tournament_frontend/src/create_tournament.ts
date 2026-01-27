import { navigate } from "../../auth_frontend/src_auth/app"
import { show2FAPage } from "../../auth_frontend/src_auth/login/2FA";
import * as Socket from "../../socket_manager/socket";

/* =======================
   TOURNAMENT STATE
======================= */
let currentTournament = {
  name: "",
  maxPlayers: 4
};

const CARD_HEIGHT = 56;
const GAP_R16 = 40;
const MATCH_STEP = CARD_HEIGHT + GAP_R16; // 96
const COLUMN_TOP_PADDING = 32; // px

/* =======================
   PAGE TEMPLATES
======================= */
export function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = `
    fixed top-6 right-6 z-50
      bg-[#1a1a1d] text-white
      pointer-events-auto
      min-w-[300px] max-w-md
      px-4 py-3 rounded-xl
      shadow-2xl border border-white/10
      flex items-start gap-3
      transform transition-all duration-300
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

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

function tournamentListTemplate(tournaments?: any[]) {
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
        ${tournaments && tournaments.length > 0 ? tournaments.map(t => tournamentCard(t.name, t.status, t.id, t.maxPlayers)).join('') : '<p class="text-gray-400">No tournaments available.</p>'}
      </div>
    </div>
  `;
}

function tournamentCard(
  name: string,
  status: "Upcoming" | "Ongoing" | "Finished",
  id: string,
  maxPlayers: number
) {
  const statusColor =
    status === "Upcoming"
      ? "bg-yellow-500/20 text-yellow-400"
      : status === "Ongoing"
        ? "bg-green-500/20 text-green-400"
        : "bg-gray-500/20 text-gray-400";
  const canJoin = status !== "Finished";
  return `
    <div class="rounded-2xl border border-white/10 p-5 flex flex-col justify-between
                bg-gradient-to-br from-[#1a1a1d] to-[#0f0f11]">
      <div>
        <h3 class="text-xl font-semibold mb-2">${name}</h3>
        <div class="flex gap-2 items-center mb-3">
          <span class="text-xs px-3 py-1 rounded-full ${statusColor}">
            ${status}
          </span>
          <span class="text-xs text-gray-500">${maxPlayers} Players</span>
        </div>
      </div>
      <div class="flex gap-2 mt-4">
        <button
          class="flex-1 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 transition text-sm view-bracket-btn"
          data-tournament-name="${name}"
          data-max-players="${maxPlayers}">
          View Bracket
        </button>
        ${canJoin
      ? `
          <button
            class="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm join-tournament-btn"
            data-tournament-id="${id}"
            data-tournament-name="${name}">
            Join
          </button>
          `
      : ""
    }
      </div>
    </div>
  `;
}

/* =======================
   TOURNAMENT BRACKET GENERATION
======================= */

function generateBracketHTML( participants?: any, matches?: any) {
    return generate4PlayerBracket(participants, matches);
}

function generate4PlayerBracket(participants: any[] = [], matches?: any) {
  // Helper to safely get participant nickname
  const p = (i: number) => participants[i]?.nickname ?? "TBD";
  
  // Determine tournament stage based on matches data
  const semiFinal1 = matches?.semiFinals?.[0] || {};
  const semiFinal2 = matches?.semiFinals?.[1] || {};
  const final = matches?.final || {};
  
  const sf1Winner = semiFinal1.winner || "TBD";
  const sf2Winner = semiFinal2.winner || "TBD";
  const sf1Score1 = semiFinal1.score1 ?? "—";
  const sf1Score2 = semiFinal1.score2 ?? "—";
  const sf2Score1 = semiFinal2.score1 ?? "—";
  const sf2Score2 = semiFinal2.score2 ?? "—";
  
  const finalScore1 = final.score1 ?? "—";
  const finalScore2 = final.score2 ?? "—";

  return `
    <div class="w-full h-full flex items-center justify-center gap-12">
      <!-- Semi-Finals -->
      <div class="relative w-44" style="height: 280px;">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider text-center absolute -top-12 w-full">
          Semi-Final
        </h3>
        <!-- SF 1 -->
        <div class="absolute left-0" style="top: 48px;">
          ${matchCard(p(0), String(sf1Score1), p(1), String(sf1Score2))}
        </div>
        <!-- SF 2 -->
        <div class="absolute left-0" style="top: 168px;">
          ${matchCard(p(2), String(sf2Score1), p(3), String(sf2Score2))}
        </div>
      </div>
      
      <!-- Connector Lines SF → F -->
      <div class="flex flex-col justify-center">
        <svg width="60" height="280" class="text-white/20">
          ${connectorPair(60, 110, 60, 3)}
        </svg>
      </div>
      
      <!-- Final -->
      <div class="relative w-44" style="height: 280px;">
        <h3 class="text-xs text-gray-400 uppercase tracking-wider text-center absolute -top-12 w-full">
          Final
        </h3>
        <div class="absolute left-0" style="top: 108px;">
          ${matchCard(sf1Winner, String(finalScore1), sf2Winner, String(finalScore2))}
        </div>
      </div>
    </div>
  `;
}


let joinedPlayers: string[] = [];
const friends = [
  { id: 1, username: "ayoub" },
  { id: 2, username: "youssef" },
  { id: 3, username: "hamza" },
];

function tournamentBracketTemplate(maxPlayers: number, participants: any, matches?: any) {
  return `
    <div class="w-full h-full flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <!-- Tournament Info -->
        <div>
          <h2 class="text-2xl font-bold">${currentTournament.name}</h2>
          <p class="text-xs text-gray-400 mt-1">
            Single Elimination • ${currentTournament.maxPlayers} Players
          </p>
        </div>
        <!-- Actions -->
        <div class="flex items-center gap-3">
          <button
            id="add-player-btn"
            class="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition">
            + Add Player
          </button>
          <button
            id="back-to-tournaments"
            class="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20 transition">
            ← Back
          </button>
        </div>
      </div>
      
      <!-- Bracket Container -->
      <div class="flex-1 flex items-center justify-center p-4">
        ${generateBracketHTML(participants, matches)}
      </div>
      
      <!-- Invite Friends Modal -->
      <div
        id="invite-modal"
        class="fixed inset-0 bg-black/60 hidden items-center justify-center z-50"
      >
        <div class="bg-neutral-900 w-96 rounded-xl p-4 border border-white/10">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Invite Friends</h3>
            <button id="close-invite-modal" class="text-gray-400 hover:text-white">✕</button>
          </div>
          <div id="friends-list" class="flex flex-col gap-2 max-h-72 overflow-y-auto">
            <!-- Friends injected here -->
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFriendsList(friends: { id: number; username: string }[]) {
  const list = document.getElementById("friends-list");
  if (!list) return;
  list.innerHTML = friends
    .map(
      (friend) => `
      <div class="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg">
        <span>${friend.username}</span>
        <button
          data-id="${friend.id}"
          class="invite-btn px-3 py-1 text-xs rounded-md bg-red-600 hover:bg-red-600 transition">
          Invite
        </button>
      </div>
    `
    )
    .join("");
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
  document.getElementById("create")?.addEventListener("click", async () => {
    const nameInput = document.getElementById("tournament-name-input") as HTMLInputElement;
    const playersSelect = document.getElementById("max-players-select") as HTMLSelectElement;
    currentTournament.name = nameInput.value || "New Tournament";
    currentTournament.maxPlayers = parseInt(playersSelect.value);
    const result = await fetch("/tournament/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tournamentname: currentTournament.name,
        maxPlayers: currentTournament.maxPlayers,
      }),
    })
    const body = await result.json();
    if (result.ok) {
      showToast("Tournament created successfully!");
      // 🔥 SHOW BRACKET IMMEDIATELY
      renderTournamentBracket(
        currentTournament.name,
        currentTournament.maxPlayers
      );
      navigate(
        `/tournement/bracket/${currentTournament.name}?maxPlayers=${currentTournament.maxPlayers}`
      );
      // still notify backend
      const socket = Socket.getSocketInstance();
      socket?.emit("tournament:create", {
        room: currentTournament.name,
      });
    }
    else
      showToast(body.message || "Error creating tournament.");
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

export async function renderTournamentList() {
  const main = document.getElementById("dashboard-content");
  if (!main) return;
  const result = await fetch("/tournament/list", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const tournament = await result.json();
  console.log("Tournaments data:", tournament);
  main.innerHTML = tournamentListTemplate(tournament.tournaments || []);
  attachListHandlers();
}

function attachListHandlers() {
  document.getElementById("back-to-entry")?.addEventListener("click", () => {
    Tournament();
    navigate("/tournement");
  });
  // View Bracket
  document.querySelectorAll(".view-bracket-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const target = e.currentTarget as HTMLElement;
      currentTournament.name = target.dataset.tournamentName || "Tournament";
      const partic = await fetch(`/tournament/My/status?tournamentName=${encodeURIComponent(currentTournament.name)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Participant status:", partic);
      if (partic.ok) {
        const tournamentstatus = await fetch(`/tournament/check?tournamentName=${encodeURIComponent(currentTournament.name)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });
        const body = await tournamentstatus.json();
        console.log("Tournament status:", body);
        currentTournament.maxPlayers = body.maxPlayers || 4;
        renderTournamentBracket(currentTournament.name, currentTournament.maxPlayers);
        navigate(`/tournament/bracket/${currentTournament.name}?maxPlayers=${currentTournament.maxPlayers}`);
      }
    });
  });
  // Join Tournament
  document.querySelectorAll(".join-tournament-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const target = e.currentTarget as HTMLElement;
      const tournamentId = target.dataset.tournamentId;
      const tournamentName = target.dataset.tournamentName;
      const maxPlayers = target.dataset.maxPlayers ? parseInt(target.dataset.maxPlayers) : 4;
      if (!tournamentId || !tournamentName) return;
      const result = await fetch("/tournament/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tournamentName: tournamentName,
        }),
      });
      const body = await result.json();
      if (!result.ok) {
        showToast(body.message || "Error joining tournament.");
        return;
      }
      const Me = await fetch("/auth/verify", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const socket = Socket.getSocketInstance();
      socket?.emit("tournament:join", {
        tournamentId,
        tournamentName: tournamentName,
      });
      socket?.once("tournament:joined", () => {
        console.log("Joined tournament:", tournamentName);
        showToast("Joined tournament successfully!");
        //start the tournament
        if (body.message === "Tournament Full") {
          console.log("Starting tournament as it is full", body.tournament.maxPlayers);
          socket?.emit("matchmaking:start", {
            tournamentName: tournamentName,
            maxPlayers: body.tournament.maxPlayers,
          });
        }
      });
    });
  });
}

export async function renderTournamentBracket(tournamentName?: string, maxPlayers?: number) {
  const main = document.getElementById("dashboard-content");
  if (!main) return;
  const Players = Number(maxPlayers) || 4;
  console.log("{Debug}", tournamentName, "----", maxPlayers);
  
  // Fetch participants
  const Participant = await fetch(
    `/tournament/participant/list?tournamentname=${encodeURIComponent(tournamentName || "")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const participantBody = await Participant.json();
  
  // Fetch match results
  const matchesResponse = await fetch(
    `/tournament/matches?tournamentname=${encodeURIComponent(tournamentName || "")}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  const matchesBody = await matchesResponse.json();
  
  main.innerHTML = tournamentBracketTemplate(Players, participantBody, matchesBody);
  
  // Setup socket listeners for real-time updates
  const socket = Socket.getSocketInstance();
  
  // Listen for match completions to update bracket
  socket?.on("match:completed", (data: any) => {
    console.log("Match completed:", data);
    // Refresh the bracket
    renderTournamentBracket(tournamentName, maxPlayers);
  });
  
  socket?.on("tournament:roundCompleted", (data: any) => {
    console.log("Round completed:", data);
    showToast(`${data.round} completed!`);
    // Refresh the bracket
    renderTournamentBracket(tournamentName, maxPlayers);
  });
  
  socket?.on("tournament:finished", (data: any) => {
    console.log("Tournament finished:", data);
    showToast(`🏆 Tournament Winner: ${data.winner}!`);
    // Refresh the bracket
    renderTournamentBracket(tournamentName, maxPlayers);
  });
  
  const addBtn = document.getElementById("add-player-btn");
  addBtn?.addEventListener("click", async () => {
    console.log("Add Player clicked");
    const modal = document.getElementById("invite-modal");
    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
    const friends = await fetch("/api/users/getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(res => res.json());
    console.log("Friends data:", friends);
    renderFriendsList(friends.users);
  });
  
  document.getElementById("close-invite-modal")?.addEventListener("click", () => {
    const modal = document.getElementById("invite-modal");
    modal?.classList.add("hidden");
    modal?.classList.remove("flex");
  });
  
  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains("invite-btn")) return;
    const friendId = target.getAttribute("data-id");
    if (!friendId) return;
    target.textContent = "Invited";
    target.classList.add("opacity-50", "cursor-not-allowed");
    target.setAttribute("disabled", "true");
    const socket = Socket.getSocketInstance();
    socket?.once("InvitationSended", () => {
      showToast("Invitation sent!");
      navigate(`/tournament/bracket/tournamentName=${tournamentName}?maxPlayers=${maxPlayers}`);
    });
    const response = await fetch("/auth/verify", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // VERY IMPORTANT FOR Cookies
    });
    const responseJson = await response.json()
    const userID = responseJson.id as string;
    socket?.emit("tournament:invite", {
      tournamentName: tournamentName,
      userId: userID,
      friendId: friendId,
    });
    console.log(`Invited friend ID: ${friendId}`);
  });
  
  document.getElementById("back-to-tournaments")?.addEventListener("click", () => {
    renderTournamentList();
    navigate("/tournement/list");
  });
}