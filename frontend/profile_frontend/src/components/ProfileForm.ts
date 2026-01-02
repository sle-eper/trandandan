import { User } from './../User.ts';
import type { UserProfile } from '../User.ts';
import axios from 'axios';
import { ChangePasswordModal } from './ChangePassword.ts';

// import { ChangePasswordModal } from './ChangePassword.ts';

export class ProfileForm {
    //  private formData: UserProfile;
    private oldProfileData: UserProfile | null = null;
    private userData: UserProfile | null = null;
    private avatarPreview: string = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
    private isOnline: boolean = true;
    private selectedAvatarFile: File | null = null;

    private async loadUserData(): Promise<void> {
    try {
   
      this.userData = await User.fetchUserProfile();
      // console.log('Loaded user data:', `http://localhost:8080/uploads/default.png`, this.userData)
      if (this.userData) {
        this.oldProfileData = JSON.parse(JSON.stringify(this.userData));
        this.avatarPreview = this.userData.avatarUrl || this.avatarPreview;
        if (this.userData.onlineStatus !== 'offline') {
          this.isOnline = true;
        } else {
          this.isOnline = false;
        }
        console.log('User profile loaded:', this.userData.avatarUrl);
      } else {
        console.log('No existing profile found, using defaults');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } 
  }


     render(): string {
        const username = this.userData?.username || '';
        const email = this.userData?.email || '';
        const displayName = this.userData?.displayName || '';
        const bio = this.userData?.bio || '';

        return ` 
            <div class="w-full max-w-4xl mx-auto h-full p-6">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <svg class="text-yellow-500" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                    <path d="M4 22h16"></path>
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
                 Profile
                </h1>
                <p class="text-gray-400">Edit your profile details</p>
            </div>
        

          <!-- Main Card -->
          <div class="bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div class="p-8">
              <!-- Avatar Section -->
              <div class="flex flex-col items-center mb-8">
                <div class="relative group">
                  <div class="relative">
                    <img 
                      id="avatar-img"
                      src="http://localhost:8080/uploads/${this.userData?.avatarUrl || 'default.png'}" 
                      alt="Avatar" 
                      class="w-32 h-32 rounded-full border-4 border-red-500 shadow-lg shadow-red-500/50 object-cover"
                    />
                    <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                        <circle cx="12" cy="13" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                  
                  <label 
                    for="avatar-upload" 
                    class="absolute bottom-0 right-0 bg-red-500 hover:bg-red-600 p-2.5 rounded-full cursor-pointer shadow-lg transition-all hover:scale-110"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                      <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    class="hidden"
                  />
                </div>
                
                <h2 class="mt-4 text-2xl font-bold text-white">${displayName || username}</h2>
                <div class="flex items-center gap-2 mt-2">
                  <div id="status-indicator" class="w-2.5 h-2.5 rounded-full ${this.isOnline ? 'bg-green-500' : 'bg-gray-500'} animate-pulse"></div>
                  <span id="status-text" class="text-sm text-gray-400">${this.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>
              <!-- Form Fields -->
              <div class="space-y-6">
                <!-- Username & Email Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="username" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E64249" stroke-width="2">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Username
                    </label>
                    <input 
                      id="username" 
                      name="username" 
                      type="text" 
                      value="${username}"
                      class="w-full px-4 py-3 bg-gray-900/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-gray-500"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label for="email" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E64249" stroke-width="2">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                      </svg>
                      Email
                    </label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value="${email}"
                      class="w-full px-4 py-3 bg-gray-900/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-gray-500"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <!-- Display Name -->
                <div>
                  <label for="displayName" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E64249" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                    </svg>
                    Display Name
                  </label>
                  <input 
                    id="displayName" 
                    name="displayName" 
                    type="text"
                    value="${displayName}"
                    class="w-full px-4 py-3 bg-gray-900/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-gray-500"
                    placeholder="Your in-game display name"
                  />
                </div>

                <!-- Bio -->
                <div>
                  <label for="bio" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E64249" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                    Bio
                  </label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    rows="3"
                    class="w-full px-4 py-3 bg-gray-900/50 text-white rounded-xl border border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all placeholder-gray-500 resize-none"
                    placeholder="Tell us about yourself..."
                  >${bio}</textarea>
                </div>

                <!-- Online Status Toggle -->
                <div class="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-semibold text-gray-300">Online Status</h3>
                      <p class="text-xs text-gray-500 mt-0.5">Show your availability to other players</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        id="online-toggle"
                        type="checkbox" 
                        ${this.isOnline ? 'checked' : ''}
                        class="sr-only peer"
                      />
                      <div class="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-4 mt-8">
                <button 
                  id="cancel-btn"
                  class="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg"
                >
                  Cancel
                </button>
                <button 
                  id="save-btn"
                  class="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105"
                >
                  Save Changes
                </button>
              </div>

              <!-- Change Password Link -->
              <div class="mt-6 text-center">
                <button 
                  id="change-password-btn"   
                  class="text-sm text-gray-400 hover:text-red-500 transition-colors underline"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-6 text-center text-sm text-gray-500">
            <p>Profile changes are saved automatically</p>
          </div>
        </div>
      
    `;
  } 

    private attachEventListeners(): void {
    const avatarInput = document.getElementById('avatar-upload') as HTMLInputElement;
    const onlineToggle = document.getElementById('online-toggle') as HTMLInputElement;
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');

    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', () => {
        const modal = new ChangePasswordModal();
        modal.show();
      });
    }

    if (avatarInput) {
      avatarInput.addEventListener('change', this.handleAvatarChange.bind(this));
    }
    if (onlineToggle) {
      onlineToggle.addEventListener('change', this.handleStatusToggle.bind(this));
    }
    if (saveBtn) {
      saveBtn.addEventListener('click', this.handleSave.bind(this));
    }
    if (cancelBtn) {
      cancelBtn.addEventListener('click', this.handleCancel.bind(this));
    }
  }
 
 private handleAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      input.value = '';
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      input.value = '';
      return;
    }

    this.selectedAvatarFile = file;

    const reader = new FileReader();
    reader.onloadend = () => {
      this.avatarPreview = reader.result as string;
      const avatarImg = document.getElementById('avatar-img') as HTMLImageElement;
      if (avatarImg) {
        avatarImg.src = this.avatarPreview;
      }
    };
    reader.readAsDataURL(file);
  }

  private handleStatusToggle(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.isOnline = checkbox.checked;
    
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    
    if (indicator && statusText) {
      if (this.isOnline) {
        indicator.className = 'w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse';
        statusText.textContent = 'Online';
      } else {
        indicator.className = 'w-2.5 h-2.5 rounded-full bg-gray-500 animate-pulse';
        statusText.textContent = 'Offline';
      }
    }
  }

  private hasChanges(oldData: UserProfile | null, newData: UserProfile): Partial<UserProfile> | null {
    if (!oldData) {
      return newData;
    }

    const changed: Partial<UserProfile> = {};

    for (const key in newData) {
      const k = key as keyof UserProfile;
      if (newData[k] !== oldData[k]) {
        changed[k] = newData[k];
      }
    }

  return Object.keys(changed).length > 0 ? changed : null;
  }

  private async uploadAvatar(file: File): Promise<string | null> {
  try {
    
    const formData = new FormData();
    formData.append('file', file);
   
    const response = await User.updateAvatar(formData);
    
    if (response) {
      console.log('Avatar uploaded successfully:', response);
      return response;
    }
    
    return null;
    
  } catch (error: any) {
    console.error('Avatar upload failed:', error);
  
    if (error.response?.status === 413) {
      alert('File is too large. Please choose a smaller image.');
    } else if (error.response?.status === 400) {
      alert(error.response.data?.error || 'Invalid file. Please try again.');
    } else {
      alert('Failed to upload avatar. Please try again.');
    }
    
    return null;
  }
}
  private async handleSave(): Promise<void> {
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.textContent = 'Saving...';
      saveBtn.setAttribute('disabled', 'true');
    }
   try {
    
      const formData: UserProfile = {
      username: (document.getElementById('username') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      displayName: (document.getElementById('displayName') as HTMLInputElement).value,
      bio: (document.getElementById('bio') as HTMLTextAreaElement).value,
      avatarUrl: this.avatarPreview,
      onlineStatus: this.isOnline ? 'online' : 'offline'
    };
   
     let changedData = this.hasChanges(this.oldProfileData, formData);
    if (!changedData && !this.selectedAvatarFile) {
      alert('No changes detected to save.');
      return;
    }

    if (this.selectedAvatarFile) {
      console.log('Uploading new avatar...');
      const uploadedAvatarPath = await this.uploadAvatar(this.selectedAvatarFile);
      
      if (!uploadedAvatarPath) {
        alert('Failed to upload avatar. Profile not saved.');
        return;
      }

      console.log('Avatar uploaded successfully:', uploadedAvatarPath);
      formData.avatarUrl = uploadedAvatarPath;
      
      if (changedData) {
        changedData.avatarUrl = uploadedAvatarPath;
      } else {
        changedData = { avatarUrl: uploadedAvatarPath };
      }
    }
    if (changedData) {
      console.log('Saving profile with changes:', changedData);
      const success = await User.saveUserProfile(changedData);
      
      if (success) {
        this.userData = formData;
        this.oldProfileData = { ...formData };
        this.selectedAvatarFile = null;
        this.avatarPreview = formData.avatarUrl || '';
        
        alert('Profile updated successfully!');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    }

  } catch (error) {
    console.error('Save error:', error);
    alert('An error occurred while saving. Please try again.');
  } finally {
  
    if (saveBtn) {
      saveBtn.textContent = 'Save Changes';
      saveBtn.removeAttribute('disabled');
    }
  }
  
   
  }

  private handleCancel(): void {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      const container = document.getElementById('app');
      if (container) {
        this.mount('app');
      }
    }
  }

    async mount(containerId: string): Promise<void> {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    // Fetch user data
    await this.loadUserData();
    
    // Render with actual data
    container.innerHTML = this.render();
    this.attachEventListeners();
  }

   }