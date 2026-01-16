import axios from "axios";
import { PlayerFriendship} from '../Player.ts';
import type { Player } from '../Player.ts';
import { ProfileForm}  from './ProfileForm.ts';
import  { User } from '../User.ts';
import { navigate } from "../../../auth_frontend/src_auth/app.ts";
// import { socket } from "../../../auth_frontend/src_auth/login/login.ts";
import { getSocketInstance } from "../../../socket_manager/socket.ts";
import { createFriendRequestNotification } from "./RequestHandling.ts";
import {Toast} from "./ProfileForm.ts";
// Types

// Socket listener for friend request received
export const friendRequestReceivedHandler = (from: string, myId: string,friendId: string, notifId: string) => {
 
  console.log('Friend request received myId:', myId, 'with frienID:', friendId, 'from:', from, 'notifId:', notifId); ;
  const existing = document.querySelector(`[data-notif-id="${notifId}"]`);
  if (existing) existing.remove();
  
  createFriendRequestNotification(from, myId, friendId, notifId);
}
// getSocketInstance()?.on('friendRequestReceived', (from: string, myId: string,friendId: string, notifId: string) => {
 
//   console.log('Friend request received myId:', myId, 'with frienID:', friendId, 'from:', from, 'notifId:', notifId); ;
//   const existing = document.querySelector(`[data-notif-id="${notifId}"]`);
//   if (existing) existing.remove();
  
//   createFriendRequestNotification(from, myId, friendId, notifId);
// });

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
    console.log('Checking friendship status for playerId:', playerId, 'currentUserId:', this.currentUserId);
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
      console.log('Generating action buttons for current user profile...');
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
        <button id="unfriend-${player.id}"
                class="px-6 py-3 rounded-xl bg-white/5 border border-white/10
                       text-white font-semibold
                       hover:bg-red-500/20 hover:border-red-500 transition-all duration-300 flex items-center gap-2">
          <span class="material-symbols-outlined">person_remove</span>
          <span>Unfriend</span>
        </button>
       
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
  async showPlayerProfile(playerId?: number): Promise<void> {
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
    let status: FriendshipStatus = { isFriend: false, isPending: false, isCurrentUser: false };
    if (!playerId && this.currentUserId) {
      playerId = this.currentUserId;
      status  = await this.checkFriendshipStatus(playerId);
      if (status.isCurrentUser) 
         player = await PlayerFriendship.fetchPlayerProfile(this.currentUserId);
    }
    else if (playerId)
   { 
       status  = await this.checkFriendshipStatus(playerId)
      if (status.isCurrentUser) {
      player  = await PlayerFriendship.fetchPlayerProfile(this.currentUserId!);
      }
      else {
        player = await PlayerFriendship.fetchPlayerProfile(playerId);
      }
    }
    console.log('Fetched player data:', player,);
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
              <div class="w-32 h-32 rounded-full bg-gradient-to-br from-[#FD1D1D] to-[#711F21] 
                          flex items-center justify-center text-5xl font-bold text-white
                          shadow-lg">
                ${player.avatar ? 
                  `<img src="/api/uploads/${player.avatar}" alt="${player.display_name}" class="w-full h-full rounded-full object-cover"/>` :
                  this.escapeHtml(player.display_name.charAt(0).toUpperCase())
                }
              </div>
              
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
        if (this.showEditProfileCallback) {
          console.log('Edit profile button clicked, rendering edit profile component...');
          this.showEditProfileCallback.mount('dashboard-content');
        }
      });
    } else if (status.isFriend) {
      // const messageBtn = document.getElementById(`send-message-${player.id}`);
      const unfriendBtn = document.getElementById(`unfriend-${player.id}`);

      // messageBtn?.addEventListener('click', () => {
      //   console.log('Send message to player:', player.id);
      //   // Add messaging logic
      // });

      unfriendBtn?.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to unfriend ${player.display_name}?`)) {
          await this.unfriendUser(player.id);
          this.showPlayerProfile(player.id);
        }
      }
   );
    } else if (status.isPending) {
      const cancelBtn = document.getElementById(`cancel-request-${player.id}`);
      cancelBtn?.addEventListener('click', async () => {
        console.log('Attaching cancel friend request listener for player:', player.id);
        await this.cancelFriendRequest(player.id);
        getSocketInstance()?.emit('cancelFriendRequest', player.id, String(currentUserId));
       
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
          getSocketInstance()?.emit('friendRequestSent', currentUserId, player.id);
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

  private async unfriendUser(friendId: number): Promise<void> {
    try {
      const response = await axios.delete(`/api/users/friends/removeFriend/${friendId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      
      console.log('Unfriended user:', response.data);
    } catch (error) {
      console.error('Error unfriending user:', error);
      throw error;
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export const socketNotificationListenerHandler = async (from : string,myId: string,friendId: string) => {
  console.log('Friend request accepted:', {from, myId, friendId});
  
  const manager = new PlayerProfileManager();
  await manager.showPlayerProfile(parseInt(myId));
  Toast.success('Friend request accepted');
 
}

export const socketNotificationListenerRejectHandler = async (from : string,myId: string,friendId: string) => {
  console.log('Friend request rejected:', {from, myId, friendId});

  const manager = new PlayerProfileManager();
  await manager.showPlayerProfile(parseInt(myId));
  Toast.error('Friend request rejected');
}


// getSocketInstance()?.on('socketNotificationListener', async (from : string,myId: string,friendId: string) => {
//   console.log('Friend request accepted:', {from, myId, friendId});
  
//   const manager = new PlayerProfileManager();
//   await manager.showPlayerProfile(parseInt(myId));
//   Toast.success('Friend request accepted');
 
// });
// getSocketInstance()?.on('friendRequestRejected', async (from : string,myId: string,friendId: string) => {
//   console.log('Friend request rejected:', {from, myId, friendId});
  
 
//   const manager = new PlayerProfileManager();
//   await manager.showPlayerProfile(parseInt(myId));
//   Toast.error('Friend request rejected');
// });
// Export for easy usage
