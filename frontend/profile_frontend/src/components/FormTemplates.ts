
export const profileFormTemplate = (): string => `
  <form id="profile-form" class="space-y-6">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-300">Username</label>
      <input id="username" name="username" type="text" required class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
      <input id="email" name="email" type="email" required class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <label for="displayName" class="block text-sm font-medium text-gray-300">Display Name</label>
      <input id="displayName" name="displayName" type="text" class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <label for="bio" class="block text-sm font-medium text-gray-300">Bio</label>                  
      <input id="bio" name="bio" type="text" class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <label for="avatarUrl" class="block text-sm font-medium text-gray-300">Avatar URL</label>
      <input id="avatarUrl" name="avatarUrl" type="url" class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <label for="onlineStatus" class="block text-sm font-medium text-gray-300">Online Status</label>
      <input id="onlineStatus" name="onlineStatus" type="checkbox" class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
      <input id="password" name="password" type="password" required class="mt-1 block w-full p-2 bg-transparent rounded-xl border border-gray-700 focus:border-[#E64249]" />
    </div>
    <div>
      <button type="submit" class="w-full py-2 px-4 bg-[#E64249] text-white rounded-xl hover:bg-[#D2313E]">Save Profile</button>
    </div>
  </form>
`;