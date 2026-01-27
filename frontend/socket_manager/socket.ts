import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function reSetSocket(){
  socket = null;
}

export function socketInstance(): Socket {
  if (!socket) {
    socket = io("https://localhost:8443", {
      path: "/socket.io",
      withCredentials: true,
      // autoConnect: true,
      transports: ["websocket"],
      // autoConnect: true,
    });
  }
  return socket;
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
