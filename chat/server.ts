// import path from "path";
// import { fileURLToPath } from "url";
// import fastifyStatic from "@fastify/static";

import {getFriendsOfUser,getMyId} from "./src/db/database.ts"


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
    socket.on('get_friends',(name)=>{
      const friends =  getFriendsOfUser(getMyId(name.name));
      socket.emit('friends_list',friends);
      // console.log(`your name ${name.name} and your id ${getMyId(name.name)} and friends mane: ${friends.map(f => f.name).join(', ')}`)
    })
  });
});


await server.listen({port:3000});
console.log(`server run in port 3000`);
