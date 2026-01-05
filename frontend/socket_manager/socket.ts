import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// export function initSocket(userId: string) {
//   if (!socket) {
//     // console.log("waaaaaaaa3");
//     socket = io("http://localhost:3000", {
//       auth: { userId },
//       autoConnect: true
//     });
//   }
//   return socket;
// }

// export function getSocket(): Socket {
//   if (!socket) {
//     // console.log("walo");
//     throw new Error("Socket not initialized");//TODO catch 
//   }
//   return socket;
// }

function getUserId(): string | null {
  const id = localStorage.getItem("userId");
  if (!id || id === "undefined" || id === "null") return null;
  return id;
}


export function socketInstance(): Socket | null {
  if (!socket) {
    const userId = getUserId();
    if (!userId) return null;

    socket = io("http://localhost:3000", {
      auth: { userId },
      autoConnect: true,
    });
  }
  return socket;
}