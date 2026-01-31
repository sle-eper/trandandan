import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function reSetSocket(){
  socket.disconnect();
  socket = null;
}

export function socketInstance(): Socket {
  if (!socket) {
    return socket = io("https://localhost:8443", {
      path: "/socket.io",
      withCredentials: true,
      transports: ["websocket"],
    });
  }
  return socket;
}


export function getSocketInstance(): Socket | null {
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/') {
    return null;
  }
  if (!socket) {
    return socketInstance();
  }
  return socket;
}
