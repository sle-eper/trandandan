

// import { socket } from "../../../auth_frontend/src_auth/login/login";
import { getSocketInstance } from "../../../socket_manager/socket.ts";

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
    flex items-center justify-between gap-3
      w-full px-4 py-2 rounded-2xl
      bg-[#1a1a1a]/90 border border-[#FD1D1D]/40
      shadow-lg backdrop-blur-lg
      animate-slide-in
  `;

  popupNotif.innerHTML = `
    
    <span class="text-sm truncate">
      🤝 <strong>${from}</strong> rejected your play request
    </span>

    <div class="flex gap-2 shrink-0">
      <button
        class="accept-btn px-3 py-1.5 text-xs font-bold rounded
              bg-green-500/20 text-green-400
              hover:bg-green-500 hover:text-white transition">
        Accept
      </button>

      <button
        class="reject-btn px-3 py-1.5 text-xs font-bold rounded
              bg-red-500/20 text-red-400
              hover:bg-red-500 hover:text-white transition">
        Decline
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


export function createNotificationMenuItem(
  notification: HTMLElement,
  from: string,
  friendId: string,
  notifId: string,
  userId: string
): void {
// console.log("Creating menu item for notifId:", notifId, "from:", from, "friendId:", friendId, "userId:", userId);
  const notifIcon = document.getElementById("notif-icon");
  if(!notifIcon)return;
   notifIcon.innerHTML = `<span class=" text-[#E63946]  material-symbols-outlined">
                          notifications_unread
                          </span>`
  const menuNotif = document.createElement("div");
  menuNotif.setAttribute('data-notif-id', notifId);
  menuNotif.className = `
    w-full px-4 py-2 text-white/90
    hover:bg-[#E63946]/20 transition
    rounded-lg
  `;
  
  menuNotif.innerHTML = `
    <div class="flex justify-between items-center mb-2">
      <p class="text-xs text-gray-400">
        🤝 <strong class="text-red-400 font-semibold">${from}</strong>
        sent you a friend request
      </p>

      <span
        class="close-btn material-symbols-outlined text-gray-400
              hover:text-white cursor-pointer text-sm">
        close
      </span>
    </div>

    <div class="flex gap-2">
          <button
            class="menu-accept-btn px-3 py-1.5 text-xs font-bold rounded
                  bg-green-500/20 text-green-400
                  hover:bg-green-500 hover:text-white transition">
            Accept
          </button>

          <button
            class="menu-reject-btn px-3 py-1.5 text-xs font-bold rounded
                  bg-red-500/20 text-red-400
                  hover:bg-red-500 hover:text-white transition">
            Decline
          </button>
        </div>
  `;


  notification.prepend(menuNotif);

  menuNotif.querySelector(".close-btn")?.addEventListener("click", () => {
    getSocketInstance()?.emit("removeNotif", notifId);
    menuNotif.remove();
    const container = document.getElementById("notification-menu");
    if(!container)return;
    if(container.children.length === 0)
    {
      if(container.classList.contains("hidden")) return;
        container.classList.add("opacity-0");
        container.classList.add("hidden")
        notifIcon.innerHTML = `<span class="  material-symbols-outlined">
                            notifications
                            </span>`
    }
  });

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
        body: JSON.stringify(friendId)
      });

      if (response.ok) {
        acceptBtn.innerHTML = '<span class="relative z-10">✓ Accepted</span>';
        acceptBtn.classList.add('bg-green-500');
        
        
            getSocketInstance()?.emit('acceptFriendRequest', notifId, friendId, userId);
          console.error('Error accepting friend request:');
        
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
        body: JSON.stringify(friendId)
      }); 

      if (response.ok) {
        rejectBtn.innerHTML = '<span class="relative z-10">✓ Declined</span>';
        
        getSocketInstance()?.emit('rejectFriendRequest', notifId, friendId, userId);
        
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
        body: JSON.stringify( friendId)
      });

      if (response.ok) {
        menuAcceptBtn.textContent = '✓ Accepted';
        menuAcceptBtn.classList.add('bg-green-500', 'text-white');
      
        getSocketInstance()?.emit('acceptFriendRequest', notifId, friendId, userId);
        removeNotificationFromUI(notifId);

            // const container = document.getElementById("notification-menu");
            // if(!container)return;
            // console.log(`******************************${container.children.length }********************************************`);
            // if(container.children.length === 0)
            // {
            //   // console.log("ssssssssssssssssssssssss")
            // //   if(container.classList.contains("hidden")) return;
            // //     container.classList.add("opacity-0");
            // //     container.classList.add("hidden")
            // //     // notifIcon.innerHTML = `<span class="  material-symbols-outlined">
            // //     //                     notifications
            // //     //                     </span>`
            // }
        
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
        body: JSON.stringify(friendId)
      });

      if (response.ok) {
        menuRejectBtn.textContent = '✓ Declined';
        
        getSocketInstance()?.emit('rejectFriendRequest', notifId, friendId, userId);
        
        
        removeNotificationFromUI(notifId);

          // const container = document.getElementById("notification-menu");
          // if(!container)return;
          // if(container.children.length === 0)
          // {
          //   if(container.classList.contains("hidden")) return;
          //     container.classList.add("opacity-0");
          //     container.classList.add("hidden")
          //     // notifIcon.innerHTML = `<span class="  material-symbols-outlined">
          //     //                     notifications
          //     //                     </span>`
          // }
        
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
  const notifIcon = document.getElementById("notif-icon");
  if(!notifIcon)
      return;

  const elements = document.querySelectorAll(`[data-notif-id="${notifId}"]`);
  elements.forEach(el => {
    (el as HTMLElement).style.opacity = '0';
    (el as HTMLElement).style.transform = 'translateX(20px)';
    el.remove();
  });

    const container = document.getElementById("notification-menu");
    if(!container)return;
    // console.log(`******************************${container.children.length }********************************************`);
    if(container.children.length === 0)
    {
      // console.log("ssssssssssssssssssssssss")
      if(container.classList.contains("hidden")) return;
        container.classList.add("opacity-0");
        container.classList.add("hidden")
        notifIcon.innerHTML = `<span class="  material-symbols-outlined">
                            notifications
                            </span>`
    }
        
}

// getSocketInstance()?.on('friendRequestCancelled', (data: { notifId: string }) => {
//   removeNotificationFromUI(data.notifId);
// });

export const  friendRequestCancelledHandler = (data: { notifId: string }) => {
  removeNotificationFromUI(data.notifId);
}
