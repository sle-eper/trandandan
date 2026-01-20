import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(){
  socket = null;
}

export function socketInstance(): Socket | null {

  return socket = io("http://localhost:3000", {
    withCredentials: true,
    autoConnect: true,
    // transports: ['websocket'],mak
  });
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
