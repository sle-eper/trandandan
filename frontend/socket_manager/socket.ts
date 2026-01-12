import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// export function initSocket(userId: string) {
//   if (!socket) {
//     /
//     socket = io("http://localhost:3000", {
//       auth: { userId },
//       autoConnect: true
//     });
//   }
//   return socket;
// }

// export function getSocket(): Socket {
//   if (!socket) {
//     /
//     throw new Error("Socket not initialized");//TODO catch 
//   }
//   return socket;
// }


export function getSocket() {
  socket = null;
}

function getUserId(): string | null {
  const path = window.location.pathname;
  if (path === "/login") return null;
  if (path === "/signup") return null;
  if (path === "/") return null;
  let id = localStorage.getItem("userId");
  if (!id || id === "undefined" || id === "null") return null;
  id = id.trim();
  if (!id) return null;
  return id;
}


export function socketInstance(): Socket | null {
  const userId = getUserId();
  if (!userId) return null;

  const opts = socket?.io.opts as any;
  if (socket && opts?.auth && opts.auth.userId === userId) {

    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io("http://localhost:3000", {
    auth: { userId },
    autoConnect: true,
  });
  return socket;
}
