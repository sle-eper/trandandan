import { homeTemplate } from "./templates";
import { fetchMatchHistory } from "./api.ts";

export async function showHome() {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `<p class="text-gray-400">Loading...</p>`;

  try {
    // you probably already have user info stored somewhere
    const response = await fetch("/auth/verify", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // VERY IMPORTANT FOR Cookies
  });
  const responseJson = await response.json()
  const userId:number = responseJson.id;

  const matches = await fetchMatchHistory(userId);

  const totalMatches = matches.length;

    const wins = matches.filter(
      (m: any) => m.winner_id === userId
    ).length;

    const winRate =
      totalMatches > 0
        ? Math.round((wins / totalMatches) * 100)
        : 0;

    content.innerHTML = homeTemplate({
      totalMatches,
      wins,
      winRate,
      matches: matches.slice(0, 5), // recent 5
      userId,
    });
  } catch (err) {
    console.error(err);
    content.innerHTML = `<p class="text-red-500">Failed to load dashboard</p>`;
  }
}
