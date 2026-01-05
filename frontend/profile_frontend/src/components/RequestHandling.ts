

// import { socket } from "../../../auth_frontend/src_auth/login/login";
import { socketInstance } from "../../../socket_manager/socket.ts";

// ============================================
export function createFriendRequestNotification(
  from: string, 
  userId: string, 
  friendId: string, 
  notifId: string
) {
  const notification = document.getElementById("notification-menu");
  const container = document.getElementById("play-notification-container");
  
  if (!container) return;

  
  const existing = document.getElementById("play-notification");
  if (existing) existing.remove();

  
  const popupNotif = createPopupNotification(from, friendId, notifId, userId);
  container.appendChild(popupNotif);

 
  requestAnimationFrame(() => {
    popupNotif.style.transform = 'translateY(0)';
    popupNotif.style.opacity = '1';
  });


  setTimeout(() => {
    if (popupNotif.parentElement) {
      popupNotif.style.transform = 'translateY(-20px)';
      popupNotif.style.opacity = '0';
      setTimeout(() => popupNotif.remove(), 300);
    }
  }, 10000);

  
  if (notification) {
    createNotificationMenuItem(notification, from, friendId, notifId, userId);
  }
}


function createPopupNotification(
  from: string, 
  friendId: string, 
  notifId: string, 
  userId: string
): HTMLDivElement {
  const popupNotif = document.createElement("div");
  popupNotif.id = "play-notification";
  popupNotif.setAttribute('data-notif-id', notifId);
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
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
        <svg class="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </div>
      
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-white truncate">Friend Request</p>
        <p class="text-xs text-gray-400 truncate">
          <strong class="text-red-400">${from}</strong> wants to connect
        </p>
      </div>
    </div>

    <div class="flex gap-2 shrink-0">
      <button class="accept-btn group relative px-4 py-2 text-xs font-bold rounded-lg
                overflow-hidden transition-all duration-200
                bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white
                border border-green-500/30 hover:border-green-500
                hover:shadow-lg hover:shadow-green-500/50 hover:scale-105">
        <span class="relative z-10">✓</span>
      </button>
      <button class="reject-btn group relative px-4 py-2 text-xs font-bold rounded-lg
                overflow-hidden transition-all duration-200
                bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white
                border border-red-500/30 hover:border-red-500
                hover:shadow-lg hover:shadow-red-500/50 hover:scale-105">
        <span class="relative z-10">✕</span>
      </button>
    </div>
  `;

  const acceptBtn = popupNotif.querySelector(".accept-btn") as HTMLButtonElement;
  const rejectBtn = popupNotif.querySelector(".reject-btn") as HTMLButtonElement;

  if (acceptBtn) {
    attachAcceptHandler(acceptBtn, rejectBtn, popupNotif, friendId, notifId, userId);
  }

  if (rejectBtn) {
    attachRejectHandler(rejectBtn, acceptBtn, popupNotif, friendId, notifId, userId);
  }

  return popupNotif;
}


function createNotificationMenuItem(
  notification: HTMLElement,
  from: string,
  friendId: string,
  notifId: string,
  userId: string
): void {
  const menuNotif = document.createElement("div");
  menuNotif.setAttribute('data-notif-id', notifId);
  menuNotif.className = `
    group relative w-full px-4 py-3 
    bg-gray-900/40 hover:bg-red-500/10
    border-l-4 border-red-500/50 hover:border-red-500
    transition-all duration-200
    cursor-pointer
  `;
  
  menuNotif.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/30 
                  flex items-center justify-center border border-red-500/40 group-hover:border-red-500/60 transition">
        <svg class="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2 mb-1">
          <p class="text-sm font-semibold text-white">Friend Request</p>
          <span class="text-[10px] text-gray-500">now</span>
        </div>
        <p class="text-xs text-gray-400 mb-3">
          <strong class="text-red-400 font-semibold">${from}</strong> sent you a friend request
        </p>

        <div class="flex gap-2">
          <button class="menu-accept-btn flex-1 px-3 py-1.5 text-xs font-bold rounded-lg
                    bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white
                    border border-green-500/30 hover:border-green-500
                    transition-all duration-200 hover:scale-105">
            Accept
          </button>
          <button class="menu-reject-btn flex-1 px-3 py-1.5 text-xs font-bold rounded-lg
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

 
  const menuAcceptBtn = menuNotif.querySelector(".menu-accept-btn") as HTMLButtonElement;
  const menuRejectBtn = menuNotif.querySelector(".menu-reject-btn") as HTMLButtonElement;

  if (menuAcceptBtn) {
    attachMenuAcceptHandler(menuAcceptBtn, menuRejectBtn, menuNotif, friendId, notifId, userId);
  }

  if (menuRejectBtn) {
    attachMenuRejectHandler(menuRejectBtn, menuAcceptBtn, menuNotif, friendId, notifId, userId);
  }
}


function attachAcceptHandler(
  acceptBtn: HTMLButtonElement,
  rejectBtn: HTMLButtonElement | null,
  popupNotif: HTMLElement,
  friendId: string,
  notifId: string,
  userId: string
): void {
  acceptBtn.addEventListener('click', async () => {
    try {
      acceptBtn.setAttribute('disabled', 'true');
      rejectBtn?.setAttribute('disabled', 'true');
      acceptBtn.innerHTML = '<span class="relative z-10">⏳</span>';
      
      const response = await fetch('/api/users/friends/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendId, notifId })
      });

      if (response.ok) {
        acceptBtn.innerHTML = '<span class="relative z-10">✓ Accepted</span>';
        acceptBtn.classList.add('bg-green-500');
        
        
            socketInstance()?.emit('acceptFriendRequest', notifId, friendId);
        
        
        removeNotificationFromUI(notifId);
        
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


function attachRejectHandler(
  rejectBtn: HTMLButtonElement,
  acceptBtn: HTMLButtonElement | null,
  popupNotif: HTMLElement,
  friendId: string,
  notifId: string,
  userId: string
): void {
  rejectBtn.addEventListener('click', async () => {
    try {
      acceptBtn?.setAttribute('disabled', 'true');
      rejectBtn.setAttribute('disabled', 'true');
      rejectBtn.innerHTML = '<span class="relative z-10">⏳</span>';
      
      const response = await fetch('/api/users/friends/reject', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendId, notifId })
      }); 

      if (response.ok) {
        rejectBtn.innerHTML = '<span class="relative z-10">✓ Declined</span>';
        
        socketInstance()?.emit('rejectFriendRequest', notifId, friendId);
        
        removeNotificationFromUI(notifId);
        
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


function attachMenuAcceptHandler(
  menuAcceptBtn: HTMLButtonElement,
  menuRejectBtn: HTMLButtonElement | null,
  menuNotif: HTMLElement,
  friendId: string,
  notifId: string,
  userId: string
): void {
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
        body: JSON.stringify({ friendId, notifId })
      });

      if (response.ok) {
        menuAcceptBtn.textContent = '✓ Accepted';
        menuAcceptBtn.classList.add('bg-green-500', 'text-white');
        
       
        socketInstance()?.emit('acceptFriendRequest', notifId, friendId);
       
        removeNotificationFromUI(notifId);
        
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


function attachMenuRejectHandler(
  menuRejectBtn: HTMLButtonElement,
  menuAcceptBtn: HTMLButtonElement | null,
  menuNotif: HTMLElement,
  friendId: string,
  notifId: string,
  userId: string
): void {
  menuRejectBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    
    try {
      menuAcceptBtn?.setAttribute('disabled', 'true');
      menuRejectBtn.setAttribute('disabled', 'true');
      menuRejectBtn.textContent = 'Declining...';
      
      const response = await fetch('/api/users/friends/reject', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ friendId, notifId })
      });

      if (response.ok) {
        menuRejectBtn.textContent = '✓ Declined';
        
        socketInstance()?.emit('rejectFriendRequest', notifId, friendId);
        
        
        removeNotificationFromUI(notifId);
        
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


function removeNotificationFromUI(notifId: string): void {
  const elements = document.querySelectorAll(`[data-notif-id="${notifId}"]`);
  elements.forEach(el => {
    (el as HTMLElement).style.opacity = '0';
    (el as HTMLElement).style.transform = 'translateX(20px)';
    setTimeout(() => el.remove(), 300);
  });
}


socketInstance()?.on('friendRequestAccepted', (data: { friendId: string, friendName: string }) => {
  console.log('Friend request accepted from:', data.friendName);
 
});
socketInstance()?.on('friendRequestRejected', (data: { friendId: string }) => {
  console.log('Friend request rejected from:', data.friendId);
  
});

socketInstance()?.on('friendRequestCancelled', (data: { notifId: string }) => {
  removeNotificationFromUI(data.notifId);
});