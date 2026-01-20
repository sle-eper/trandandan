import { homeTemplate } from "./templates";
import { fetchMatchHistory } from "./api.ts";

export async function showHome() {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `<p class="text-gray-400">Loading...</p>`;

  try {
    // Verify user
    const response = await fetch("/auth/verify", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // REQUIRED for cookies
    });

    const responseJson = await response.json();
    const userId: number = responseJson.id;

    // Fetch matches
    const matches = await fetchMatchHistory(userId);

    const totalMatches = matches.length;

    // ✅ wins MUST come first
    const wins = matches.filter(
      (m: any) => m.winner_id === userId
    ).length;

    const losses = totalMatches - wins;

    const winRate =
      totalMatches > 0
        ? Math.round((wins / totalMatches) * 100)
        : 0;

    const avgScore = totalMatches
      ? Math.round(
          matches.reduce((sum: number, m: any) => {
            const myScore =
              m.user1_id === userId ? m.user1_score : m.user2_score;
            return sum + myScore;
          }, 0) / totalMatches
        )
      : 0;

    // Render dashboard
    content.innerHTML = homeTemplate({
      totalMatches,
      wins,
      winRate,
      losses,
      avgScore,
      matches: matches.slice(0, 5),
      userId,
    });

  } catch (err) {
    console.error(err);
    content.innerHTML = `<p class="text-red-500">Failed to load dashboard</p>`;
  }
}
