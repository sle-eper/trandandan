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


export function getSocket(){
  socket = null;
}

// function getUserId(): string | null {
//   const id = localStorage.getItem("userId");
//   if (!id || id === "undefined" || id === "null") return null;
//   return id;
// }


export function socketInstance(): Socket | null {
  // const userId = getUserId();
  // console.log("socketInstance userId:", userId);
  // if (!userId) return null;

  // if (socket && socket.io.opts.auth.userId === userId)
  // {
  //   console.log("socketInstance existing socket returned");
  //   return socket;
  // }

  // if (socket) {
  //   socket.disconnect();
  // }

  socket = io("http://localhost:3000/game", {
    withCredentials: true,
    autoConnect: true,
  });
  // console.log("socketInstance new socket created");
  // return socket;
}

export function getSocketInstance(): Socket | null {
  // get current url
  const currentPath = window.location.pathname;
  if(currentPath === '/login' || currentPath === '/') {
    return null;
  }
  if(!socket) {
    return socketInstance();
  } 
  return socket;
}
