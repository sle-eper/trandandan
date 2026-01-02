import { navigate } from "../app";

/* ================= TEMPLATE ================= */

export const twoFATemplate = () => `
  <div id="2fa-page"
    class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg
           border border-gray-700 w-full h-full
           px-6 py-5 flex flex-col items-center">

    <h2 class="text-xl font-bold mb-1 text-center">
      Two-Factor Authentication
    </h2>

    <p class="text-gray-400 mb-3 text-xs text-center max-w-sm">
      Scan the QR code and enter the 6-digit code
    </p>

    <div class="bg-white p-2 rounded-xl mb-4">
      <img id="2fa-qr" class="w-32 h-32 object-contain" />
    </div>

    <div class="flex gap-2 mb-3">
      ${Array.from({ length: 6 })
        .map(
          (_, i) => `
        <input
          id="2fa-code-${i}"
          type="text"
          maxlength="1"
          inputmode="numeric"
          class="w-9 h-11 text-center text-lg bg-transparent
                 border border-gray-700 rounded-lg
                 focus:border-red-500 outline-none"
        />`
        )
        .join("")}
    </div>

    <div id="2fa-error"
      class="text-red-500 text-xs h-4 opacity-0 transition-opacity">
    </div>

    <button id="2fa-btn"
      class="w-full max-w-xs bg-red-600 text-white py-2 rounded-lg mt-3">
      Verify
    </button>
  </div>
`;

/* ================= RENDER ================= */

export function show2FAPage() {
  const content = document.getElementById("dashboard-content");
  if (!content) return;

  content.innerHTML = `
    <div class="h-full flex items-center justify-center">
      ${twoFATemplate()}
    </div>
  `;

  setup2FA();
  attach2FAHandlers();
}

/* ================= SETUP ================= */

async function setup2FA() {
  const qr = document.getElementById("2fa-qr") as HTMLImageElement | null;
  if (!qr) return;

  const res = await fetch("http://localhost:8080/api/auth/2f/setup", {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();
  qr.src = data.qrImage;
}

/* ================= HANDLERS ================= */

function attach2FAHandlers() {
  const btn = document.getElementById("2fa-btn") as HTMLButtonElement;
  const errorBox = document.getElementById("2fa-error");

  const inputs = Array.from({ length: 6 }, (_, i) =>
    document.getElementById(`2fa-code-${i}`) as HTMLInputElement
  );

  if (!btn || inputs.some(i => !i)) return;

  inputs.forEach((input, i) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/\D/g, "");
      if (input.value && i < 5) inputs[i + 1].focus();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Backspace" && !input.value && i > 0) {
        inputs[i - 1].focus();
      }
      if (e.key === "Enter") verify2FA();
    });
  });

  btn.addEventListener("click", verify2FA);

  async function verify2FA() {
    const code = inputs.map(i => i.value).join("");

    if (!/^\d{6}$/.test(code)) {
      if (errorBox) {
        errorBox.textContent = "Enter a valid 6-digit code";
        errorBox.classList.remove("opacity-0");
      }
      return;
    }

    const res = await fetch(
      "http://localhost:8080/api/auth/2f/verify-2fa",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    if (!res.ok) {
      if (errorBox) {
        errorBox.textContent = "Invalid code";
        errorBox.classList.remove("opacity-0");
      }
      return;
    }

    navigate("/dashboard");
  }
}
