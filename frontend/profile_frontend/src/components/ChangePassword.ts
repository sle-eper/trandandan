import axios from "axios";

// components/ChangePasswordModal.ts
export class ChangePasswordModal {
  private modal: HTMLElement | null = null;

  show() {
    const modalHTML = `
      <div id="password-modal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-black/40 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full p-8 animate-fade-in">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E64249" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Change Password
            </h2>
            <button id="close-modal" class="text-gray-400 hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form id="change-password-form" class="space-y-5">
            <!-- Current Password -->
            <div>
              <label for="current-password" class="block text-sm font-semibold text-gray-300 mb-2">
                Current Password
              </label>
              <div class="relative">
                <input 
                  id="current-password" 
                  type="password" 
                  required
                  class="w-full px-4 py-3 bg-gray-900/50  text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                  placeholder="Enter current password"
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label for="new-password" class="block text-sm font-semibold text-gray-300 mb-2">
                New Password
              </label>
              <div class="relative">
                <input 
                  id="new-password" 
                  type="password" 
                  required
                  minlength="8"
                  class="w-full px-4 py-3 bg-gray-900/50  text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                  placeholder="Enter new password "
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirm-password" class="block text-sm font-semibold text-gray-300 mb-2">
                Confirm New Password
              </label>
              <div class="relative">
                <input 
                  id="confirm-password" 
                  type="password" 
                  required
                  class="w-full px-4 py-3 bg-gray-900/50  text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                  placeholder="Confirm new password"
                />
                <button 
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div id="password-error" class="hidden bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-sm text-red-400"></div>

            <!-- Success Message -->
            <div id="password-success" class="hidden bg-green-500/10 border border-green-500/50 rounded-xl p-3 text-sm text-green-400"></div>

            <!-- Buttons -->
            <div class="flex gap-3 pt-2">
              <button 
                type="button"
                id="cancel-password-btn"
                class="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                type="submit"
                id="submit-password-btn"
                class="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-red-500/50"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('password-modal');
    this.attachEventListeners();
  }

  private attachEventListeners() {
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-password-btn');
    const form = document.getElementById('change-password-form') as HTMLFormElement;

    closeBtn?.addEventListener('click', () => this.hide());
    cancelBtn?.addEventListener('click', () => this.hide());
    
   
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  private async handleSubmit(e: Event) {
    e.preventDefault();
    
    const currentPassword = (document.getElementById('current-password') as HTMLInputElement).value;
    const newPassword = (document.getElementById('new-password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;
    
    const errorDiv = document.getElementById('password-error')!;
    const successDiv = document.getElementById('password-success')!;
    
    // Hide previous messages
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    // Validation
    if (newPassword !== confirmPassword) {
      this.showError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      this.showError('Password must be at least 8 characters');
      return;
    }

    if (currentPassword === newPassword) {
      this.showError('New password must be different from current password');
      return;
    }

    // Disable submit button
    const submitBtn = document.getElementById('submit-password-btn') as HTMLButtonElement;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Changing...';

    try {
      const response = await axios.post('/api/users/User/changePassword', {
        currentPassword,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
   
        },
        withCredentials: true
      });

      const data = await response.data;

      if (!response || response.status !== 200) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Success
      this.showSuccess('Password changed successfully!');
      
      // Reset form and close after delay
      setTimeout(() => {
        this.hide();
      }, 2000);

    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Change Password';
    }
  }

  private showError(message: string) {
    const errorDiv = document.getElementById('password-error')!;
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  private showSuccess(message: string) {
    const successDiv = document.getElementById('password-success')!;
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
  }

  private hide() {
    this.modal?.remove();
  }
}