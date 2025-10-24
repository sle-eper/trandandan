import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";

import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO,{
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const userData = new Map <string,{userName:string,img:string}>()
server.ready().then(() => {
  const io = server.io;
  io.on("connection", (socket) => {
    socket.on('send_message',(msg,roomName)=>{
      console.log(roomName  ,  msg)
      socket.to(roomName).emit('receive_message', msg);
    })
    socket.on('register',(socketData)=>{
      userData.set(socket.id,socketData);
    })
    socket.on('joinToRoom',(roomName)=>{
      console.log(`in join ${roomName} from ${socket.id}`)
      socket.join(roomName);
    })
  });
});


await server.listen({port:3000});
console.log(`server run in port 3000`);
