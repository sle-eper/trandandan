import { navigate } from "../app";
export const twoFATemplate = () => `
  <div id="2fa-page"
    class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg
           border border-gray-700
           w-full h-full
           px-6 py-5 md:px-8 md:py-6
           flex flex-col items-center
           overflow-hidden">

    <h2 class="text-xl md:text-2xl font-bold mb-1 text-center">
      Two-Factor Authentication
    </h2>

    <p class="text-gray-400 mb-3 text-xs md:text-sm text-center max-w-sm">
      Scan the QR code with your authenticator app, then enter the 6-digit code
    </p>

    <!-- QR CODE -->
    <div class="bg-white p-2 rounded-xl mb-4">
      <img
        id="2fa-qr"
        src="/src_auth/images/QR.png"
        alt="2FA QR Code"
        class="w-32 h-32 md:w-36 md:h-36 object-contain"
      />
    </div>

    <!-- CODE INPUTS -->
    <div class="flex gap-2 mb-3">
      ${Array.from({ length: 6 })
    .map(
      (_, i) => `
        <input
          id="2fa-code-${i}"
          type="text"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="1"
          class="w-9 h-11 text-center text-lg bg-transparent
                 rounded-lg border border-gray-700
                 focus:border-[#E64249] outline-none"
        />
      `
    )
    .join("")}
    </div>

    <!-- ERROR -->
    <div
      id="2fa-error"
      class="text-red-500 text-xs h-4 opacity-0 transition-opacity mb-1">
    </div>

    <button
      id="2fa-btn"
      class="w-full max-w-xs bg-red-600 text-white py-2.5
             rounded-lg mt-2 hover:opacity-90 transition text-sm">
      Verify
    </button>

    <p class="text-center text-gray-400 text-xs mt-2">
      Didn’t receive the code?
      <span
        id="2fa-resend"
        class="text-[#E64249] cursor-pointer hover:underline">
        Resend
      </span>
    </p>
  </div>
`;

// Function to render 2FA inside dashboard-content
export function show2FAPage() {
  const dashboardContent = document.getElementById("dashboard-content");
  if (!dashboardContent) return;

  dashboardContent.innerHTML = `
    <div class="h-full flex flex-col justify-center items-center text-center w-full">
      ${twoFATemplate()}
    </div>
  `;

  attach2FAHandlers();
}

// 2FA logic
function attach2FAHandlers() {
  const btn = document.getElementById("2fa-btn") as HTMLButtonElement | null;
  const inputs = Array.from({ length: 6 }, (_, i) =>
    document.getElementById(`2fa-code-${i}`) as HTMLInputElement
  );
  const errorBox = document.getElementById("2fa-error");


  if (!btn || inputs.some((i) => !i)) return;

  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      // Allow only digits
      input.value = input.value.replace(/[^0-9]/g, "");

      if (input.value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });

    // Block non-digit keys
    input.addEventListener("keypress", (e) => {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    });
  });

  const qrImage = document.getElementById("2fa-qr") as HTMLImageElement | null;
  const submit2FA = async () => {
    const res = await fetch("/api/auth/2f/setup", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // VERY IMPORTANT FOR Cookies
    });
    console.log("2FA setup response:", res);
    const data = await res.json();
    console.log("2FA setup data:", data.qrImage);
    if (qrImage) {
      qrImage.src = data.qrImage;
    }
    const code = inputs.map((i) => i.value).join("");

    if (!/^\d{6}$/.test(code)) {
      if (errorBox) {
        errorBox.textContent = "Code must be exactly 6 digits.";
        errorBox.classList.add("opacity-100");
      }
      return;
    }


    console.log("Entered 2FA code:", code);
    navigate("/dashboard");
  };

  btn.addEventListener("click", submit2FA);

  submit2FA();
  // Enter key triggers verify
  inputs.forEach((input) =>
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        console.log("==========================================");
        console.log(inputs.map((i) => i.value).join(""));
        const response = await fetch('/api/auth/2f/verify-2fa', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code: inputs.map((i) => i.value).join("") }),
        });
        console.log("2FA verify response:", response);
        // alert("If that email exists, a reset link was sent (stub).");
        e.preventDefault();
      }
    })
  );
}