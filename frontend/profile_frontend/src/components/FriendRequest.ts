import axios from "axios";
import { PlayerFriendship} from '../Player.ts';
import type { Player } from '../Player.ts';
import { ProfileForm}  from './ProfileForm.ts';
import  { User } from '../User.ts';
import { navigate } from "../../../auth_frontend/src_auth/app.ts";
import { socket } from "../../../auth_frontend/src_auth/login/login.ts";
// Types

socket.on('friendRequestReceived', (from: string, myId: string,friendId: string) => {
 
  console.log('Friend request received myId:', myId, 'with frienID:', friendId);
  const notification = document.getElementById("notification-menu");
  const container = document.getElementById("play-notification-container");
  if (!container) return;

  const existing = document.getElementById("play-notification");
  if (existing) existing.remove();

  container.innerHTML = "";

 
  const popupNotif = document.createElement("div");
  popupNotif.id = "play-notification";
  popupNotif.className = `
    flex items-center justify-between gap-4
    w-full max-w-md px-5 py-3 rounded-xl
    bg-gradient-to-r from-gray-900/95 to-gray-800/95
    border border-red-500/30
    shadow-2xl shadow-red-500/20 backdrop-blur-xl
    transition-all duration-300 ease-out
    hover:border-red-500/50 hover:shadow-red-500/30
  `;

  popupNotif.innerHTML = `
    <div class="flex items-center gap-3 flex-1 min-w-0">
      <!-- Icon -->
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </div>
      
      <!-- Message -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate">Friend Request</p>
        <p class="text-xs text-gray-400 truncate"><strong class="text-red-400">${from}</strong> wants to connect</p>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2 shrink-0">
      <button class="accept group relative px-4 py-2 text-xs font-bold rounded-lg
                overflow-hidden transition-all duration-200
                bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white
                border border-green-500/30 hover:border-green-500
                hover:shadow-lg hover:shadow-green-500/50 hover:scale-105">
        <span class="relative z-10">✓</span>
      </button>
      <button class="reject group relative px-4 py-2 text-xs font-bold rounded-lg
                overflow-hidden transition-all duration-200
                bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white
                border border-red-500/30 hover:border-red-500
                hover:shadow-lg hover:shadow-red-500/50 hover:scale-105">
        <span class="relative z-10">✕</span>
      </button>
    </div>
  `;

  container.appendChild(popupNotif);

 
  requestAnimationFrame(() => {
    popupNotif.style.transform = 'translateY(0)';
    popupNotif.style.opacity = '1';
  });


  const acceptBtn = popupNotif.querySelector(".accept");
  const rejectBtn = popupNotif.querySelector(".reject");

  if (acceptBtn) {
    acceptBtn.addEventListener('click', async () => {
      try {

        acceptBtn.setAttribute('disabled', 'true');
        rejectBtn?.setAttribute('disabled', 'true');
        
        const response = await fetch('/api/users/friends/accept', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify( friendId )
        });
        console.log("response:", response);
        if (response.ok) {
          acceptBtn.innerHTML = '<span class="relative z-10">✓ Accepted</span>';
          acceptBtn.classList.add('bg-green-500');
          
      
          socket.emit('acceptFriendRequest',  friendId );
          
        
          setTimeout(() => {
            popupNotif.style.transform = 'translateX(400px)';
            popupNotif.style.opacity = '0';
            setTimeout(() => popupNotif.remove(), 300);
          }, 1000);
        } else {
          throw new Error('Failed to accept request');
        }
      } catch (error) {
        console.error('Error accepting friend request:', error);
        acceptBtn.innerHTML = '<span class="relative z-10">Error</span>';
        acceptBtn.classList.add('bg-red-500');
        
     
        setTimeout(() => {
          acceptBtn.removeAttribute('disabled');
          rejectBtn?.removeAttribute('disabled');
          acceptBtn.innerHTML = '<span class="relative z-10">✓</span>';
          acceptBtn.classList.remove('bg-red-500');
        }, 2000);
      }
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', async () => {
      try {
        console.log("Rejecting friend request...");
        acceptBtn?.setAttribute('disabled', 'true');
        rejectBtn.setAttribute('disabled', 'true');
        
        
        const response = await fetch('/api/users/friends/reject', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({friendId} )
        }); 

        if (response.ok) {
          
          rejectBtn.innerHTML = '<span class="relative z-10">✓ Declined</span>';
          
          
          socket.emit('rejectFriendRequest', {myId: from, friendId });
          
         
          setTimeout(() => {
            popupNotif.style.transform = 'translateX(400px)';
            popupNotif.style.opacity = '0';
            setTimeout(() => popupNotif.remove(), 300);
          }, 1000);
        } else {
          throw new Error('Failed to reject request');
        }
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        rejectBtn.innerHTML = '<span class="relative z-10">Error</span>';
        
       
        setTimeout(() => {
          acceptBtn?.removeAttribute('disabled');
          rejectBtn.removeAttribute('disabled');
          rejectBtn.innerHTML = '<span class="relative z-10">✕</span>';
        }, 2000);
      }
    });
  }

 
  setTimeout(() => {
    if (popupNotif.parentElement) {
      popupNotif.style.transform = 'translateY(-20px)';
      popupNotif.style.opacity = '0';
      setTimeout(() => popupNotif.remove(), 300);
    }
  }, 10000);


  if (notification) {
    const menuNotif = document.createElement("div");
    menuNotif.className = `
      group relative w-full px-4 py-3 
      bg-gray-900/40 hover:bg-red-500/10
      border-l-4 border-red-500/50 hover:border-red-500
      transition-all duration-200
      cursor-pointer
    `;
    
    menuNotif.innerHTML = `
      <div class="flex items-start gap-3">
        <!-- Avatar Icon -->
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 
                    flex items-center justify-center border border-red-500/40 group-hover:border-red-500/60 transition">
          <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-2 mb-1">
            <p class="text-sm font-semibold text-white">Friend Request</p>
            <span class="text-[10px] text-gray-500">now</span>
          </div>
          <p class="text-xs text-gray-400 mb-3">
            <strong class="text-red-400 font-semibold">${from}</strong> sent you a friend request
          </p>

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button class="menu-accept flex-1 px-3 py-1.5 text-xs font-bold rounded-lg
                      bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white
                      border border-green-500/30 hover:border-green-500
                      transition-all duration-200 hover:scale-105">
              Accept
            </button>
            <button class="menu-reject flex-1 px-3 py-1.5 text-xs font-bold rounded-lg
                      bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white
                      border border-red-500/30 hover:border-red-500
                      transition-all duration-200 hover:scale-105">
              Decline
            </button>
          </div>
        </div>
      </div>
    `;

    notification.prepend(menuNotif);

    
    const menuAcceptBtn = menuNotif.querySelector(".menu-accept");
    const menuRejectBtn = menuNotif.querySelector(".menu-reject");

    if (menuAcceptBtn) {
      menuAcceptBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        try {
         
          menuAcceptBtn.setAttribute('disabled', 'true');
          menuRejectBtn?.setAttribute('disabled', 'true');
          menuAcceptBtn.textContent = 'Accepting...';
          
         
          const response = await fetch('/api/users/friends/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ friendId })
          });

          if (response.ok) {
            menuAcceptBtn.textContent = '✓ Accepted';
            menuAcceptBtn.classList.add('bg-green-500', 'text-white');
            
            // Notify via socket
            socket.emit('acceptFriendRequest', { myId: from, friendId });
            
           
            setTimeout(() => {
              menuNotif.style.opacity = '0';
              menuNotif.style.transform = 'translateX(-20px)';
              setTimeout(() => menuNotif.remove(), 300);
            }, 1500);
          } else {
            throw new Error('Failed to accept');
          }
        } catch (error) {
          console.error('Error accepting friend request:', error);
          menuAcceptBtn.textContent = 'Failed';
          menuAcceptBtn.classList.add('bg-red-500');
          
         
          setTimeout(() => {
            menuAcceptBtn.removeAttribute('disabled');
            menuRejectBtn?.removeAttribute('disabled');
            menuAcceptBtn.textContent = 'Accept';
            menuAcceptBtn.classList.remove('bg-red-500');
          }, 2000);
        }
      });
    }

    if (menuRejectBtn) {
      menuRejectBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        
        try {
          
          menuAcceptBtn?.setAttribute('disabled', 'true');
          menuRejectBtn.setAttribute('disabled', 'true');
          menuRejectBtn.textContent = 'Declining...';
          
         
          const response = await fetch('/api/users/friends/reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ friendId })
          });

          if (response.ok) {
            menuRejectBtn.textContent = '✓ Declined';
            
           
            socket.emit('rejectFriendRequest', { myId: from, friendId });
            
          
            setTimeout(() => {
              menuNotif.style.opacity = '0';
              menuNotif.style.transform = 'translateX(-20px)';
              setTimeout(() => menuNotif.remove(), 300);
            }, 1000);
          } else {
            throw new Error('Failed to reject');
          }
        } catch (error) {
          console.error('Error rejecting friend request:', error);
          menuRejectBtn.textContent = 'Failed';
       
          setTimeout(() => {
            menuAcceptBtn?.removeAttribute('disabled');
            menuRejectBtn.removeAttribute('disabled');
            menuRejectBtn.textContent = 'Decline';
          }, 2000);
        }
      });
    }
  }
});






interface FriendshipStatus {
  isFriend: boolean;
  isPending: boolean;
  isCurrentUser: boolean;
}

// Player Profile Manager Class
export class PlayerProfileManager {
  private currentUserId: number | null = null;
  private showEditProfileCallback: ProfileForm | null = null;

  constructor() {
    this.showEditProfileCallback = new ProfileForm();
  }

  // Initialize with current user ID
  async initialize(): Promise<void> {
    const currentUser = await User.fetchUserProfile();
    console.log('Current user profile in PlayerProfileManager:', currentUser);
    if (currentUser) {
      this.currentUserId = currentUser.id ?? null;
    }
  }

  

  // Check friendship status
  private async checkFriendshipStatus(playerId: number): Promise<FriendshipStatus> {
   
    if (!this.currentUserId) {
      console.log('Initializing current user ID for friendship status check...');
      await this.initialize();
    }

    if (playerId === this.currentUserId) {
      return {
        isFriend: false,
        isPending: false,
        isCurrentUser: true
      };
    }

    try {
  
      const isFriend = await PlayerFriendship.checkFriendshipStatus(playerId);
      
      if (isFriend) {
        return {
          isFriend: true,
          isPending: false,
          isCurrentUser: false
        };
      }

      const isPending = await PlayerFriendship.checkPendingRequest(playerId);
      
      return {
        isFriend: false,
        isPending,
        isCurrentUser: false
      };
    } catch (error) {
      console.error('Error checking friendship status:', error);
      return {
        isFriend: false,
        isPending: false,
        isCurrentUser: false
      };
    }
  }

  // Get action buttons HTML based on friendship status
  private getActionButtonsHTML(player: Player, status: FriendshipStatus): string {
    if (status.isCurrentUser) {
      return `
        <button id="edit-profile"
                class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FD1D1D] to-[#711F21]
                       text-white font-semibold
                       hover:shadow-[0_0_20px_#FD1D1D]
                       transition-all duration-300 flex items-center gap-2">
          <span class="material-symbols-outlined">edit</span>
          <span>Edit Profile</span>
        </button>
      `;
    }

    if (status.isFriend) {
      return `
       
      `;
    }

    if (status.isPending) {
      return `
        <button id="pending-request-${player.id}"
                class="px-6 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/50
                       text-yellow-400 font-semibold
                       cursor-not-allowed
                       flex items-center gap-2"
                disabled>
          <span class="material-symbols-outlined">schedule</span>
          <span>Request Pending</span>
        </button>
        
        <button id="cancel-request-${player.id}"
                class="px-6 py-3 rounded-xl bg-white/5 border border-white/10
                       text-white font-semibold
                       hover:bg-red-500/20 hover:border-red-500 transition-all duration-300 flex items-center gap-2">
          <span class="material-symbols-outlined">close</span>
          <span>Cancel Request</span>
        </button>
      `;
    }

    // Not friends, no pending request
    return `
      <button id="send-friend-request-${player.id}"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FD1D1D] to-[#711F21]
                     text-white font-semibold
                     hover:shadow-[0_0_20px_#FD1D1D]
                     transition-all duration-300 flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
        <span class="material-symbols-outlined">person_add</span>
        <span>Send Friend Request</span>
      </button>
      
      <button id="send-message-${player.id}"
              class="px-6 py-3 rounded-xl bg-white/5 border border-white/10
                     text-white font-semibold
                     hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
        <span class="material-symbols-outlined">chat</span>
        <span>Message</span>
      </button>
    `;
  }

  // Main function to show player profile
  async showPlayerProfile(playerId: number): Promise<void> {
    const mainContent = document.getElementById('dashboard-content');
    if (!mainContent) return;

    // Show loading state
    mainContent.innerHTML = `
      <div class="flex items-center justify-center h-full">
        <div class="text-white/50 flex flex-col items-center gap-4">
          <span class="material-symbols-outlined animate-spin text-5xl">progress_activity</span>
          <span>Loading profile...</span>
        </div>
      </div>
    `;

    // Initialize current user ID if not set
    if (!this.currentUserId) {
      console.log('Initializing current user ID...');
      await this.initialize();
    }

    // Fetch player data and friendship status
    let player: Player | null = null;
    const status  = await this.checkFriendshipStatus(playerId)
    if (status.isCurrentUser) {
     player  = await PlayerFriendship.fetchPlayerProfile(this.currentUserId!);
    }
    else {
      player = await PlayerFriendship.fetchPlayerProfile(playerId);
    }

    if (!player) {
      mainContent.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-white/50">Failed to load profile</div>
        </div>
      `;
      return;
    }

    // If it's the current user and edit component is provided
    // if (status.isCurrentUser && this.showEditProfileCallback) {
    //   console.log('Rendering edit profile component for current user...');
    //   // this.showEditProfileCallback.render();

    //   return;
    // }

    const profileHTML = `
      <div class="w-full max-w-4xl mx-auto h-full p-6">
        
        <!-- Profile Header -->
        <div class="bg-[#1a1a1a] rounded-2xl border border-white/10 p-8 mb-6 shadow-xl">
          <div class="flex items-start gap-8">
            
            <!-- Avatar -->
            <div class="relative flex-shrink-0">
              <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#FD1D1D] to-[#711F21] 
                          flex items-center justify-center text-5xl font-bold text-white
                          shadow-lg">
                ${player.avatar ? 
                  `<img src="/api/uploads/${player.avatar}" alt="${player.display_name}" class="w-full h-full rounded-2xl object-cover"/>` :
                  this.escapeHtml(player.display_name.charAt(0).toUpperCase())
                }
              </div>
              <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-[#1a1a1a]
                          ${player.online_status ? 'bg-green-500' : 'bg-gray-500'}"></div>
            </div>
            
            <!-- Basic Info -->
            <div class="flex-1">
              <h1 class="text-4xl font-bold text-white mb-2">${this.escapeHtml(player.display_name)}</h1>
              <p class="text-xl text-white/50 mb-4">@${this.escapeHtml(player.name)}</p>
              
              <div class="flex items-center gap-3 mb-6">
                <span class="px-4 py-2 rounded-full bg-white/5 text-white/70 border border-white/10 text-sm">
                  ${player.online_status ? '🟢 Online' : '⚫ Offline'}
                </span>
                ${player.best_score ? 
                  `<span class="px-4 py-2 rounded-full bg-[#FD1D1D]/20 text-[#FD1D1D] border border-[#FD1D1D]/30 text-sm font-semibold">
                    ⭐ ${player.best_score} Best Score
                  </span>` : ''
                }
                ${status.isFriend ? 
                  `<span class="px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-sm font-semibold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px]">check_circle</span> Friends
                  </span>` : ''
                }
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3">
                ${this.getActionButtonsHTML(player, status)}
              </div>
            </div>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left Column -->
          <div class="lg:col-span-1 space-y-6">
            
            <!-- About Section -->
            ${player.bio ? `
              <div class="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 shadow-xl">
                <h3 class="text-sm font-semibold text-white/50 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">info</span>
                  About
                </h3>
                <p class="text-white/80 leading-relaxed">${this.escapeHtml(player.bio)}</p>
              </div>
            ` : ''}

            <!-- Contact Info -->
            <div class="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <h3 class="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">contact_mail</span>
                Contact Info
              </h3>
              <div class="space-y-3">
                ${status.isFriend || status.isCurrentUser ? `
                  <div class="flex items-center gap-3 text-white/70">
                    <span class="material-symbols-outlined text-white/50">mail</span>
                    <span class="text-sm break-all">${this.escapeHtml(player.email)}</span>
                  </div>
                ` : `
                  <div class="flex items-center gap-3 text-white/50">
                    <span class="material-symbols-outlined">lock</span>
                    <span class="text-sm">Email hidden (not friends)</span>
                  </div>
                `}
                ${player.joined_date ? `
                  <div class="flex items-center gap-3 text-white/70">
                    <span class="material-symbols-outlined text-white/50">calendar_today</span>
                    <span class="text-sm">Joined ${new Date(player.joined_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Statistics -->
            <div class="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 shadow-xl">
              <h3 class="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">bar_chart</span>
                Statistics
              </h3>
              
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <div class="text-3xl font-bold text-white mb-2">${player.matches_played || 0}</div>
                  <div class="text-xs text-white/50 uppercase tracking-wide">Matches</div>
                </div>
                <div class="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <div class="text-3xl font-bold text-green-400 mb-2">${player.wins || 0}</div>
                  <div class="text-xs text-white/50 uppercase tracking-wide">Wins</div>
                </div>
                <div class="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <div class="text-3xl font-bold text-red-400 mb-2">${player.losses || 0}</div>
                  <div class="text-xs text-white/50 uppercase tracking-wide">Losses</div>
                </div>
              </div>
              
              <!-- Win Rate -->
              ${player.wins !== undefined && player.losses !== undefined && (player.wins + player.losses) > 0 ? `
                <div class="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-white/70">Win Rate</span>
                    <span class="text-lg font-semibold text-white">
                      ${Math.round((player.wins / (player.wins + player.losses)) * 100)}%
                    </span>
                  </div>
                  <div class="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                    <div class="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500"
                         style="width: ${(player.wins / (player.wins + player.losses)) * 100}%"></div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    mainContent.innerHTML = profileHTML;

    // Add event listeners based on status
    this.attachEventListeners(player, status, this.currentUserId!);
  }

  // Attach event listeners
  private attachEventListeners(player: Player, status: FriendshipStatus, currentUserId: number): void {
    if (status.isCurrentUser) {

      const editBtn = document.getElementById('edit-profile');
      editBtn?.addEventListener('click', () => {
        if (this.showEditProfileCallback) 

          navigate('/profile');
      });
    } else if (status.isFriend) {
      //const messageBtn = document.getElementById(`send-message-${player.id}`);
      // const unfriendBtn = document.getElementById(`unfriend-${player.id}`);

      // messageBtn?.addEventListener('click', () => {
      //   console.log('Send message to player:', player.id);
      //   // Add messaging logic
      // });

      // unfriendBtn?.addEventListener('click', async () => {
      //   if (confirm(`Are you sure you want to unfriend ${player.display_name}?`)) {
      //     await this.unfriendUser(player.id);
      //     // Refresh the profile
      //     this.showPlayerProfile(player.id);
      //   }
      // }
   // );
    } else if (status.isPending) {
      const cancelBtn = document.getElementById(`cancel-request-${player.id}`);

      cancelBtn?.addEventListener('click', async () => {
        await this.cancelFriendRequest(player.id);
        // Refresh the profile
        this.showPlayerProfile(player.id);
      });
    } else {
      const friendRequestBtn = document.getElementById(`send-friend-request-${player.id}`) as HTMLButtonElement;
      const messageBtn = document.getElementById(`send-message-${player.id}`);

      friendRequestBtn?.addEventListener('click', async () => {
        try {
          friendRequestBtn.disabled = true;
          friendRequestBtn.innerHTML = `
            <span class="material-symbols-outlined animate-spin">progress_activity</span>
            <span>Sending...</span>
          `;
          
          await this.sendFriendRequest(player.id);
          console.log('Emitting friendRequestSent event via socket...', String(currentUserId), String(player.id));
          socket.emit('friendRequestSent', currentUserId, player.id);
          // Refresh the profile to show pending state
          this.showPlayerProfile(player.id);
        } catch (error) {
          console.error('Error sending friend request:', error);
          friendRequestBtn.disabled = false;
          friendRequestBtn.innerHTML = `
            <span class="material-symbols-outlined">person_add</span>
            <span>Send Friend Request</span>
          `;
        }
      });

      messageBtn?.addEventListener('click', () => {
        console.log('Send message to player:', player.id);
      });
    }
  }

  
  private async sendFriendRequest(receiverId: number): Promise<void> {
    try {
      const response = await axios.post('/api/users/friends/request', {
        friendId: receiverId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      if (!response.status || response.status !== 201) {
        throw new Error('Failed to send friend request');
      }

      
      console.log('Friend request sent:', response.data);
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }

  private async cancelFriendRequest(receiverId: number): Promise<void> {
    try {
      const response = await axios.delete(`/api/users/friends/cancelRequest`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        params: { friendId: receiverId }
      });
      
      console.log('Friend request cancelled:', response.data);
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      throw error;
    }
  }

  // private async unfriendUser(friendId: number): Promise<void> {
  //   try {
  //     const response = await axios.delete(`http://localhost:8080/api/users/friends/${friendId}`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       withCredentials: true,
  //     });
      
  //     console.log('Unfriended user:', response.data);
  //   } catch (error) {
  //     console.error('Error unfriending user:', error);
  //     throw error;
  //   }
  // }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for easy usage
