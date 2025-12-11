// templates.ts
export const loginTemplate = () => `
  <div id="login-page" class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:w-[320px] flex flex-col justify-between mb-10 md:mb-0">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-2">Login</h2>
      <p class="text-gray-400 mb-6 text-sm md:text-base">Glad you're back!</p>
      <div class="space-y-4">
        <input id="login-username" type="text" placeholder="Username"
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
        <div class="relative">
          <input id="login-password" type="password" placeholder="Password"
            class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249] pr-10" />

        <!-- 👁 Show/hide password button -->
          <span id="toggle-password" class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 
            cursor-pointer text-gray-400 hover:text-white">
            visibility
          </span>
        </div>

        <!-- ❗ Error message area -->
        <div id="login-error"
          class="text-red-500 text-sm h-5 opacity-0 transition-opacity duration-300"></div>
      </div>
      <div class="flex items-center mt-3">
        <input id="login-remember" type="checkbox" class="mr-2 accent-[#E64249]" />
        <label for="login-remember" class="text-gray-300 text-sm">Remember me</label>
      </div>
      <button id="login-btn"
        class="w-full bg-red-600 text-white py-2 rounded-md mt-4 hover:opacity-90 transition">
        Login
      </button>
      <p id="login-forgot" class="text-center text-gray-400 text-sm mt-3 cursor-pointer hover:text-white">
        Forgot password?
      </p>
      <div class="flex items-center my-6">
        <hr class="flex-grow border-gray-700" />
        <span class="text-gray-500 text-sm mx-3">or</span>
        <hr class="flex-grow border-gray-700" />
      </div>
      <div class="flex items-center justify-center gap-6">
        <button id="login-google" class="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center cursor-pointer">
        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" 
          alt="Google" class="w-9 h-9" />
        </button>
        
        <button id="login-github" 
          class="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" 
              alt="GitHub" class="w-9 h-9 invert" />
        </button>

      </div>
    </div>

    <p class="text-center text-gray-400 text-sm mt-6">
      Don't have an account?
      <span id="login-signup" class="text-[#E64249] cursor-pointer hover:underline">Sign up</span>
    </p>
  </div>
`;

export const signupTemplate = () => `
  <div id="signup-page" class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:w-[320px] flex flex-col justify-between mb-10 md:mb-0">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-4">Sign Up</h2>
      <div class="space-y-4">
        <input id="signup-username" type="text" placeholder="Username" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
        <input id="signup-email" type="email" placeholder="Email" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
        <input id="signup-password" type="password" placeholder="Password" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
        <input id="signup-confirm" type="password" placeholder="Confirm Password" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
      </div>
      <button id="signup-btn" class="w-full bg-red-600 to-[#E64249] text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
        Sign Up
      </button>
    </div>
    <p class="text-center text-gray-400 text-sm mt-6">
      Already have an account?
      <span id="signup-login" class="text-[#E64249] cursor-pointer hover:underline">Login</span>
    </p>
  </div>
`;

export const forgotTemplate = () => `
  <div id="forgot-page" class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm h-auto md:h-[550px] flex flex-col justify-between mb-10 md:mb-0">
    <div>
      <h2 class="text-2xl md:text-3xl font-bold mb-2">Forgot Password?</h2>
      <div class="space-y-4 mt-6">
        <input id="forgot-email" type="email" placeholder="Email" class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
      </div>
      <button id="forgot-btn" class="w-full bg-red-600 text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
        Reset Password
      </button>
    </div>
    <p class="text-center text-gray-400 text-sm mt-6">
      Don’t have an account?
      <span id="forgot-signup" class="text-[#E64249] cursor-pointer hover:underline">Sign up</span>
    </p>
  </div>
`;
export const ChangePass = () => `
<div class="bg-black/40 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700 
    px-8 py-8 md:px-10 md:py-10 w-full max-w-sm md:h-[550px] md:w-[320px] mb-10 md:mb-0">

      <div>
        <h2 class="text-2xl md:text-3xl font-bold mb-4">Change Password</h2>

        <div class="space-y-4">
          <input id="change-pass" type="password" placeholder="Password" 
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />

          <input id="change-confirm" type="password" placeholder="Confirm Password" 
          class="w-full p-3 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
        </div>

        <button id="change-btn" 
        class="w-full bg-red-600 
        text-white py-2 rounded-md mt-6 hover:opacity-90 transition">
          Change Password
        </button>
      </div>

      <p id="change-back" class="text-center text-gray-400 text-sm mt-6 cursor-pointer hover:text-white">
        Back to Login
      </p>
    </div>
`;

// src/login/templates.ts
export const images: Record<string, string> = {
  "login-page": "/src_auth/images/pingpong2.jpg",
  "signup-page": "/src_auth/images/pingpong1.jpg",
  "forgot-page": "/src_auth/images/pingpong3.jpg",
  "change-page": "/src_auth/images/pingpong1.jpg",
};

export const sharedImage = (pageId: string) => `
  <div class="flex items-center justify-center md:ml-10">
    <img id="page-image"
      src="${images[pageId] || images["login-page"]}"
      alt="Illustration"
      class="w-[80%] md:w-[500px] object-contain rounded-xl hidden sm:block"/>
  </div>
`;

/* --- the existing templates follow --- */
// export const loginTemplate = () => `...`
// export const signupTemplate = () => `...`
// export const forgotTemplate = () => `...`
