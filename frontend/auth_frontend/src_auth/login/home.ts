import { homeTemplate } from "./templates";
import { fetchMatchHistory } from "./api.ts";

function drawPerformanceChart(wins: number, losses: number) {
  const canvas = document.getElementById("performanceChart");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = 60;
  const depth = 30;
  const total = wins + losses || 1;
  const winAngle = (wins / total) * Math.PI * 2;

  const winPercent = Math.round((wins / total) * 100);
  const lossPercent = 100 - winPercent;

  let hovered: "win" | "loss" | null = null;

  function drawSlice(start: number, end: number, color: string, r: number, yOffset: number) {
    ctx.beginPath();
    ctx.moveTo(cx, cy + yOffset);
    ctx.arc(cx, cy + yOffset, r, start, end);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Depth layers with gradient
    for (let i = depth; i > 0; i--) {
      const opacity = 0.15 + (i / depth) * 0.25;
      drawSlice(0, winAngle, `rgba(34,197,94,${opacity})`, radius, i);
      drawSlice(winAngle, Math.PI * 2, `rgba(239,68,68,${opacity})`, radius, i);
    }

    // Top pie slices
    drawSlice(0, winAngle, "#22c55e", hovered === "win" ? radius + 5 : radius, 0);
    drawSlice(winAngle, Math.PI * 2, "#ef4444", hovered === "loss" ? radius + 5 : radius, 0);

    // Edge highlight
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${winPercent}%`, cx, cy - 10);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#9ca3af";
    ctx.fillText("Win Rate", cx, cy + 15);

    // Floating text on hover
    if (hovered) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(
        hovered === "win" ? `${wins} Wins` : `${losses} Losses`,
        cx,
        cy - radius - 30
      );
    }
  }

  draw();

  canvas.onmousemove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    const dist = Math.sqrt(x * x + y * y);
    
    if (dist > radius + 12) {
      hovered = null;
      draw();
      return;
    }

    let angle = Math.atan2(y, x);
    if (angle < 0) angle += Math.PI * 2;
    hovered = angle <= winAngle ? "win" : "loss";
    draw();
  };

  canvas.onmouseleave = () => {
    hovered = null;
    draw();
  };
}

function drawScoreTrendChart(matches: any[], userId: number) {
  const canvas = document.getElementById("scoreTrendChart");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const recentMatches = matches.slice(0, 10).reverse();
  if (recentMatches.length === 0) return;

  const padding = 35;
  const width = canvas.width - padding * 2;
  const height = canvas.height - padding * 2;

  const scores = recentMatches.map((m: any) => 
    m.user1_id === userId ? m.user1_score : m.user2_score
  );
  const maxScore = Math.max(...scores, 10);

  // Draw grid lines
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (height * i) / 5;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + width, y);
    ctx.stroke();
  }

  // Draw line
  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 3;
  ctx.beginPath();

  recentMatches.forEach((match: any, i: number) => {
    const myScore = match.user1_id === userId ? match.user1_score : match.user2_score;
    const x = padding + (width * i) / (recentMatches.length - 1 || 1);
    const y = padding + height - (height * myScore) / maxScore;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw points
  recentMatches.forEach((match: any, i: number) => {
    const myScore = match.user1_id === userId ? match.user1_score : match.user2_score;
    const isWin = match.winner_id === userId;
    const x = padding + (width * i) / (recentMatches.length - 1 || 1);
    const y = padding + height - (height * myScore) / maxScore;

    ctx.fillStyle = isWin ? "#22c55e" : "#ef4444";
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Labels
  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Recent Matches →", canvas.width / 2, canvas.height - 10);
}

function drawWinStreakChart(matches: any[], userId: number) {
  const canvas = document.getElementById("winStreakChart");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (matches.length === 0) return;

  const recentMatches = matches.slice(0, 15).reverse();
  const barWidth = (canvas.width - 20) / recentMatches.length;
  const maxHeight = canvas.height - 40;

  recentMatches.forEach((match: any, i: number) => {
    const isWin = match.winner_id === userId;
    const x = 10 + i * barWidth;
    const height = maxHeight * 0.6;
    const y = canvas.height - 30 - height;

    ctx.fillStyle = isWin ? "#22c55e" : "#ef4444";
    ctx.fillRect(x, y, barWidth - 4, height);

    // Add subtle gradient
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, isWin ? "rgba(34,197,94,0.8)" : "rgba(239,68,68,0.8)");
    gradient.addColorStop(1, isWin ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth - 4, height);
  });

  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Match History", canvas.width / 2, canvas.height - 10);
}

export async function showHome() {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `<p class="text-gray-400">Loading...</p>`;

  try {
    const response = await fetch("/auth/verify", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const responseJson = await response.json();
    const userId: number = responseJson.id;

    const matches = await fetchMatchHistory(userId);
    const totalMatches = matches.length;
    const wins = matches.filter((m: any) => m.winner_id === userId).length;
    const losses = totalMatches - wins;

    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    const avgScore = totalMatches
      ? Math.round(
          matches.reduce((sum: number, m: any) => {
            const myScore = m.user1_id === userId ? m.user1_score : m.user2_score;
            return sum + myScore;
          }, 0) / totalMatches
        )
      : 0;

    // Calculate win streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (const match of matches) {
      if (match.winner_id === userId) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Current streak (from most recent)
    for (const match of matches) {
      if (match.winner_id === userId) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate high score
    const highScore = totalMatches
      ? Math.max(
          ...matches.map((m: any) =>
            m.user1_id === userId ? m.user1_score : m.user2_score
          )
        )
      : 0;

    // Recent form (last 5 matches)
    const recentForm = matches.slice(0, 5).map((m: any) => 
      m.winner_id === userId ? "W" : "L"
    ).join("");

    content.innerHTML = homeTemplate({
      totalMatches,
      wins,
      winRate,
      losses,
      avgScore,
      highScore,
      currentStreak,
      longestStreak,
      recentForm,
      matches: matches.slice(0, 10),
      userId,
    });

    drawPerformanceChart(wins, losses);
    drawWinStreakChart(matches, userId);

  } catch (err) {
    console.error(err);
    content.innerHTML = `<p class="text-red-500">Failed to load dashboard</p>`;
  }
}