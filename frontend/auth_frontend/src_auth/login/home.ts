import {
  homeTemplate,
  matchDetailTemplate,
  type MatchData,
  type DashboardData,
} from "./templates";
import {fetchMatchHistory} from "./api";
// Mock API function - replace with your actual API
// async function fetchMatchHistory(userId: number): Promise<MatchData[]> {
//   // Simulated match data for demo
//   return [
//     { id: 1, user1_id: userId, user2_id: 4, user1_score: 5, user2_score: 4, winner_id: userId, played_at: new Date().toISOString(), duration: 145 },
//     { id: 2, user1_id: userId, user2_id: 4, user1_score: 5, user2_score: 2, winner_id: userId, played_at: new Date(Date.now() - 3600000).toISOString(), duration: 98 },
//     { id: 3, user1_id: 4, user2_id: userId, user1_score: 5, user2_score: 3, winner_id: 4, played_at: new Date(Date.now() - 86400000).toISOString(), duration: 167 },
//     { id: 4, user1_id: userId, user2_id: 4, user1_score: 4, user2_score: 5, winner_id: 4, played_at: new Date(Date.now() - 86400000 * 2).toISOString(), duration: 203 },
//     { id: 5, user1_id: userId, user2_id: 10, user1_score: 5, user2_score: 3, winner_id: userId, played_at: new Date(Date.now() - 86400000 * 3).toISOString(), duration: 122 },
//     { id: 6, user1_id: 10, user2_id: userId, user1_score: 0, user2_score: 5, winner_id: userId, played_at: new Date(Date.now() - 86400000 * 4).toISOString(), duration: 78 },
//     { id: 7, user1_id: userId, user2_id: 7, user1_score: 5, user2_score: 4, winner_id: userId, played_at: new Date(Date.now() - 86400000 * 5).toISOString(), duration: 189 },
//     { id: 8, user1_id: 3, user2_id: userId, user1_score: 5, user2_score: 2, winner_id: 3, played_at: new Date(Date.now() - 86400000 * 6).toISOString(), duration: 134 },
//   ];
// }

let currentMatches: MatchData[] = [];
let currentUserId: number = 1;

// Expose functions to window for onclick handlers
declare global {
  interface Window {
    showMatchDetail: (index: number) => void;
    closeMatchDetail: () => void;
  }
}

window.showMatchDetail = (index: number) => {
  const modal = document.getElementById("match-detail-modal");
  const content = document.getElementById("match-detail-content");
  if (!modal || !content || !currentMatches[index]) return;

  content.innerHTML = matchDetailTemplate(currentMatches[index], currentUserId);
  modal.classList.remove("hidden");
};

window.closeMatchDetail = () => {
  const modal = document.getElementById("match-detail-modal");
  if (modal) modal.classList.add("hidden");
};

function drawPerformanceChart(wins: number, losses: number): void {
  const canvas = document.getElementById("performanceChart") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 55;
  const lineWidth = 12;

  const total = wins + losses || 1;
  const winAngle = (wins / total) * Math.PI * 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(239, 68, 68, 0.3)";
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Win arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + winAngle);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.stroke();

  // Center text
  const winRate = Math.round((wins / total) * 100);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 20px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${winRate}%`, cx, cy);
}

function drawPerformanceLineChart(matches: MatchData[], userId: number): void {
  const canvas = document.getElementById("performanceLineChart") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (matches.length < 2) {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("Need more matches for chart", canvas.width / 2, canvas.height / 2);
    return;
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartWidth = canvas.width - padding.left - padding.right;
  const chartHeight = canvas.height - padding.top - padding.bottom;

  // Group matches by day and calculate cumulative wins
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
  );

  const dataPoints: { x: number; wins: number; losses: number }[] = [];
  let cumulativeWins = 0;
  let cumulativeLosses = 0;

  sortedMatches.forEach((match, i) => {
    if (match.winner_id === userId) {
      cumulativeWins++;
    } else {
      cumulativeLosses++;
    }
    dataPoints.push({ x: i, wins: cumulativeWins, losses: cumulativeLosses });
  });

  const maxY = Math.max(...dataPoints.map(d => Math.max(d.wins, d.losses))) || 1;
  const xStep = chartWidth / (dataPoints.length - 1 || 1);

  // Draw grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();
  }

  // Draw wins line (gradient fill)
  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
  gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
  gradient.addColorStop(1, "rgba(16, 185, 129, 0)");

  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top + chartHeight);
  dataPoints.forEach((point, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (point.wins / maxY) * chartHeight;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(padding.left + (dataPoints.length - 1) * xStep, padding.top + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw wins line
  ctx.beginPath();
  dataPoints.forEach((point, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (point.wins / maxY) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw losses line
  ctx.beginPath();
  dataPoints.forEach((point, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (point.losses / maxY) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw dots
  dataPoints.forEach((point, i) => {
    const x = padding.left + i * xStep;
    const yWin = padding.top + chartHeight - (point.wins / maxY) * chartHeight;
    const yLoss = padding.top + chartHeight - (point.losses / maxY) * chartHeight;

    ctx.beginPath();
    ctx.arc(x, yWin, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#10b981";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, yLoss, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
  });

  // Legend
  ctx.fillStyle = "#10b981";
  ctx.fillRect(padding.left, canvas.height - 12, 8, 8);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "10px system-ui";
  ctx.fillText("Wins", padding.left + 12, canvas.height - 5);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(padding.left + 50, canvas.height - 12, 8, 8);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText("Losses", padding.left + 62, canvas.height - 5);
}

function drawScoreDistributionChart(matches: MatchData[], userId: number): void {
  const canvas = document.getElementById("scoreDistChart") as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (matches.length === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText("No data available", canvas.width / 2, canvas.height / 2);
    return;
  }

  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartWidth = canvas.width - padding.left - padding.right;
  const chartHeight = canvas.height - padding.top - padding.bottom;

  // Count score frequencies
  const scoreCounts: Record<number, number> = {};
  matches.forEach(match => {
    const score = match.user1_id === userId ? match.user1_score : match.user2_score;
    scoreCounts[score] = (scoreCounts[score] || 0) + 1;
  });

  const scores = Object.keys(scoreCounts).map(Number).sort((a, b) => a - b);
  const maxCount = Math.max(...Object.values(scoreCounts)) || 1;
  const barWidth = Math.min(30, chartWidth / (scores.length * 1.5));
  const gap = barWidth * 0.5;

  scores.forEach((score, i) => {
    const count = scoreCounts[score];
    const barHeight = (count / maxCount) * chartHeight;
    const x = padding.left + i * (barWidth + gap) + (chartWidth - scores.length * (barWidth + gap) + gap) / 2;
    const y = padding.top + chartHeight - barHeight;

    // Bar gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, "#8b5cf6");
    gradient.addColorStop(1, "#6366f1");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Score label
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(String(score), x + barWidth / 2, padding.top + chartHeight + 15);

    // Count on top
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText(String(count), x + barWidth / 2, y - 5);
  });

  // X-axis label
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "10px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Your Scores", canvas.width / 2, canvas.height - 2);
}

function calculateStats(matches: MatchData[], userId: number): Omit<DashboardData, 'matches' | 'userId'> {
  const totalMatches = matches.length;
  const wins = matches.filter(m => m.winner_id === userId).length;
  const losses = totalMatches - wins;
  const winRate = totalMatches ? Math.round((wins / totalMatches) * 100) : 0;

  let totalScore = 0;
  let totalConceded = 0;
  let totalDuration = 0;

  matches.forEach(m => {
    const myScore = m.user1_id === userId ? m.user1_score : m.user2_score;
    const oppScore = m.user1_id === userId ? m.user2_score : m.user1_score;
    totalScore += myScore;
    totalConceded += oppScore;
    totalDuration += m.duration || 120;
  });

  const avgScore = totalMatches ? totalScore / totalMatches : 0;
  const avgMatchDuration = totalMatches ? Math.round(totalDuration / totalMatches) : 0;

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const sortedMatches = [...matches].sort((a, b) => 
    new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  for (const match of sortedMatches) {
    if (match.winner_id === userId) {
      if (currentStreak >= 0) currentStreak++;
      else break;
    } else {
      if (currentStreak > 0) break;
      currentStreak--;
    }
  }

  // Best win streak
  for (const match of sortedMatches) {
    if (match.winner_id === userId) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return {
    totalMatches,
    wins,
    losses,
    winRate,
    avgScore,
    currentStreak: Math.max(0, currentStreak),
    bestStreak,
    totalPointsScored: totalScore,
    totalPointsConceded: totalConceded,
    avgMatchDuration,
  };
}

export async function showHome(): Promise<void> {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `
    <div class="flex items-center justify-center h-full">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p class="text-gray-400 text-sm">Loading dashboard...</p>
      </div>
    </div>
  `;

  try {

    const response = await fetch("/auth/verify", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const responseJson = await response.json();
    const userId: number = responseJson.id;

    const matches = await fetchMatchHistory(userId);
    currentMatches = matches;

    const stats = calculateStats(matches, userId);

    const dashboardData: DashboardData = {
      ...stats,
      matches: matches.slice(0, 10),
      userId,
    };

    content.innerHTML = homeTemplate(dashboardData);

    // Draw all charts
    requestAnimationFrame(() => {
      drawPerformanceChart(stats.wins, stats.losses);
      drawPerformanceLineChart(matches, userId);
      drawScoreDistributionChart(matches, userId);
    });

    // Close modal on backdrop click
    const modal = document.getElementById("match-detail-modal");
    modal?.addEventListener("click", (e) => {
      if (e.target === modal) {
        window.closeMatchDetail();
      }
    });

  } catch (e) {
    console.error(e);
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full gap-3">
        <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <p class="text-red-400">Failed to load dashboard</p>
        <button onclick="window.location.reload()" class="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition">
          Retry
        </button>
      </div>
    `;
  }
}
