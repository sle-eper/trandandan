import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function reSetSocket(){
  socket = null;
}

export function socketInstance(): Socket {
  if (!socket) {
    return socket = io("https://10.14.3.4:8443", {
      path: "/socket.io",
      withCredentials: true,
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
    console.log('Creating new socket instance');
    return socketInstance();
  } 
  console.log('Returning existing socket instance');
  return socket;
}
