// import path from "path";
// import { fileURLToPath } from "url";
// import fastifyStatic from "@fastify/static";

import {getFriendsOfUser,getMyId,changeStatusOfFriends,getStatusOfTowFriends} from "./src/db/database.ts"


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
    socket.on('send_message',(data)=>{
      const status:string = getStatusOfTowFriends(data.myId,data.friendFind.id).status
      console.log(status);
      if(status === 'accepted')
        socket.to(data.roomName).emit('receive_message', data.value);
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
    })
    socket.on('status',(data)=>{
      changeStatusOfFriends(data);
      // socket.emit('status_update',)//TODO 
    })
  });
});


await server.listen({port:3000});
console.log(`server run in port 3000`);
