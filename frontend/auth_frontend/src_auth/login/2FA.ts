import { navigate } from "../app";

// 2FA template
export const twoFATemplate = () => `
  <div id="2fa-page"
     class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
            px-8 py-8 md:px-10 md:py-10 w-full h-full flex flex-col justify-center items-center">


    <h2 class="text-2xl md:text-3xl font-bold mb-2">Two-Factor Authentication</h2>
    <p class="text-gray-400 mb-6 text-sm md:text-base">
      Enter the 6-digit code from your authenticator app or email
    </p>

    <!-- CODE INPUTS -->
    <div class="flex justify-between gap-2 mb-4">
      ${Array.from({ length: 6 })
        .map(
          (_, i) => `
        <input id="2fa-code-${i}" type="text" maxlength="1"
          class="w-10 h-12 text-center text-xl bg-transparent rounded-lg border border-gray-700
                 focus:border-[#E64249] outline-none" />
      `
        )
        .join("")}
    </div>

    <!-- ERROR MESSAGE -->
    <div id="2fa-error" class="text-red-500 text-sm h-5 opacity-0 transition-opacity duration-300 mb-2"></div>

    <button id="2fa-btn"
        class="w-full max-w-sm md:max-w-md bg-red-600 text-white py-3 text-base rounded-lg mt-4 hover:opacity-90 transition">
    Verify
    </button>



    <p class="text-center text-gray-400 text-sm mt-4">
      Didn’t receive the code?
      <span id="2fa-resend" class="text-[#E64249] cursor-pointer hover:underline">Resend</span>
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

  // Auto-focus next input
  inputs.forEach((input, idx) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && idx < inputs.length - 1) {
        inputs[idx + 1].focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && idx > 0) {
        inputs[idx - 1].focus();
      }
    });
  });

  const submit2FA = () => {
    const code = inputs.map((i) => i.value).join("");
    if (code.length !== 6) {
      if (errorBox) {
        errorBox.textContent = "Please enter the 6-digit code.";
        errorBox.classList.add("opacity-100");
      }
      return;
    }

    // Placeholder for verification logic
    console.log("Entered 2FA code:", code);

    // Navigate somewhere after success
    navigate("dashboard");
  };

  btn.addEventListener("click", submit2FA);

  // Enter key triggers verify
  inputs.forEach((input) =>
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit2FA();
      }
    })
  );
}
