import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initSocket(userId: string) {
  if (!socket) {
    socket = io("http://localhost:3000", {
      auth: { userId }
    });
  }
  return socket;
}

export function getSocket(): Socket {
  if (!socket) {
    console.log("walo");
    throw new Error("Socket not initialized");//TODO catch 
  }
  return socket;
}
