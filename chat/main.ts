import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// socket.on("connect", () => {
//   console.log("✅ Connected to server", socket.id);
// });

// socket.on("chat message", (msg) => {
//   console.log("💬 Message:", msg);
// });

// socket.on('hello',(msg)=>{
//     console.log("waaaaaaaa3");
// })