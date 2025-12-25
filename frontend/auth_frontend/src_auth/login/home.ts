import { homeTemplate } from "./templates";
// import { showDashboard } from "../dashboard/dashboard";

export function showHome() {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = homeTemplate();
}
