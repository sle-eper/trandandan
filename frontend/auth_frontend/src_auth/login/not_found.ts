// src_auth/notfound.ts
export function showNotFound(containerId = "login-app") {
  const app = document.getElementById(containerId);
  if (!app) return;
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 class="text-6xl font-bold">404</h1>
        <p class="mt-4 text-lg text-gray-300">Page not found</p>
        <a href="/dashboard" data-route class="mt-6 inline-block underline">Go home</a>
      </div>
    </div>
  `;
}
