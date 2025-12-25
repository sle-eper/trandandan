import axios from "axios";

// types.ts
interface Player {
  id: number;
  name: string;
  email: string;
  display_name: string;
  online_status: boolean;
  avatar?: string;
  bio?: string;
  matches_played?: number;
  wins?: number;
  losses?: number;
  ranking?: number;
  joined_date?: string;
}

// playerProfile.ts
const showPlayerProfile = (player: Player): void => {
  const mainContent = document.getElementById('dashboard-content'); 
  if (!mainContent) return;

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
                `<img src="${player.avatar}" alt="${player.display_name}" class="w-full h-full rounded-2xl object-cover"/>` :
                escapeHtml(player.display_name.charAt(0).toUpperCase())
              }
            </div>
            <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-[#1a1a1a]
                        ${player.online_status ? 'bg-green-500' : 'bg-gray-500'}"></div>
          </div>
          
          <!-- Basic Info -->
          <div class="flex-1">
            <h1 class="text-4xl font-bold text-white mb-2">${escapeHtml(player.display_name)}</h1>
            <p class="text-xl text-white/50 mb-4">@${escapeHtml(player.name)}</p>
            
            <div class="flex items-center gap-3 mb-6">
              <span class="px-4 py-2 rounded-full bg-white/5 text-white/70 border border-white/10 text-sm">
                ${player.online_status ? '🟢 Online' : '⚫ Offline'}
              </span>
              ${player.ranking ? 
                `<span class="px-4 py-2 rounded-full bg-[#FD1D1D]/20 text-[#FD1D1D] border border-[#FD1D1D]/30 text-sm font-semibold">
                  #${player.ranking} Rank
                </span>` : ''
              }
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
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
              <p class="text-white/80 leading-relaxed">${escapeHtml(player.bio)}</p>
            </div>
          ` : ''}

          <!-- Contact Info -->
          <div class="bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 shadow-xl">
            <h3 class="text-sm font-semibold text-white/50 uppercase tracking-wide mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">contact_mail</span>
              Contact Info
            </h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-white/70">
                <span class="material-symbols-outlined text-white/50">mail</span>
                <span class="text-sm break-all">${escapeHtml(player.email)}</span>
              </div>
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

          <!-- Recent Matches -->
          
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  mainContent.innerHTML = profileHTML;

  
  const friendRequestBtn = document.getElementById(`send-friend-request-${player.id}`) as HTMLButtonElement;
  const messageBtn = document.getElementById(`send-message-${player.id}`);
  const viewMatchesBtn = document.getElementById(`view-all-matches-${player.id}`);

  
  friendRequestBtn?.addEventListener('click', async () => {
    try {
      friendRequestBtn.disabled = true;
      friendRequestBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
        <span>Sending...</span>
      `;
      
      await sendFriendRequest(player.id);
      
      friendRequestBtn.innerHTML = `
        <span class="material-symbols-outlined">check_circle</span>
        <span>Request Sent!</span>
      `;
      friendRequestBtn.classList.remove('from-[#FD1D1D]', 'to-[#711F21]');
      friendRequestBtn.classList.add('bg-green-500');
      
    } catch (error) {
      console.error('Error sending friend request:', error);
      friendRequestBtn.disabled = false;
    //   friendRequestBtn.innerHTML = `
    //     <span class="material-symbols-outlined"> </span>
    //     <span>Failed - Try Again</span>
    //   `;
    //   friendRequestBtn.classList.add('bg-red-500');
      
      setTimeout(() => {
        friendRequestBtn.innerHTML = `
          <span class="material-symbols-outlined">person_add</span>
          <span>Send Friend Request</span>
        `;
        friendRequestBtn.classList.remove('bg-red-500');
        friendRequestBtn.classList.add('from-[#FD1D1D]', 'to-[#711F21]');
      }, 1000);
    }
  });

  // Send message
  messageBtn?.addEventListener('click', () => {
    console.log('Send message to player:', player.id);
   
  });

  // View all matches
  viewMatchesBtn?.addEventListener('click', () => {
    console.log('View all matches for player:', player.id);
   
  });
};


const sendFriendRequest = async (receiverId: number): Promise<void> => {
  try {
    const response = await axios.post('http://localhost:8080/api/users/friends/request', {
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
    
    const data = response.data;
    console.log('Friend request sent:', data);
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};


export { showPlayerProfile, sendFriendRequest };
export type { Player };