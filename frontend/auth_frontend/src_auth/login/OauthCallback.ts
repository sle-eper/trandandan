// oauth_callback.ts
import { socketInstance } from "../../../socket_manager/socket";
import { navigate } from "../app";

export function showOAuthCallback(containerId = "login-app") {
    const app = document.getElementById(containerId);
    if (!app) return;

    app.innerHTML = `
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-lg">Completing authentication...</p>
      </div>
    </div>
  `;

    handleOAuthCallback();
}

async function handleOAuthCallback() {
    try {
        // Get token from URL (if using query param method)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log("OAuth Token:", token);
        // Verify authentication with backend
        const response = await fetch("/auth/verify", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Important for cookies
        });
        console.log("OAuth verification response:", response);
        if (!response.ok) {
            throw new Error("Authentication verification failed");
        }

        const data = await response.json();
        console.log("-----------------------------------------------data", data)
        if (response.ok) {
            // Initialize socket connection
            console.log("Initializing socket after OAuth...");
            socketInstance();
            navigate("/home");

        } else {
            console.error("OAuth authentication failed");
            navigate("/login");
        }
    } catch (error) {
        console.error("OAuth callback error:", error);
        navigate("/login");
    }
}