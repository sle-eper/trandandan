// import path from "path";
// import { fileURLToPath } from "url";
// import fastifyStatic from "@fastify/static";

// import strict from "assert/strict";
import {getFriendsOfUser,getMyId,changeStatusOfFriends,getStatusOfTowFriends,insertNewUSer,getLastUser} from "./src/db/database.ts"


import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO,{
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// interface mySocket extends  {

// }

// const userData = new Map <string,{userName:string,img:string}>()
server.ready().then(() => {
  const io = server.io;
  io.on("connection", (socket) => {

    socket.on('send_message',(data)=>{
      const myId:string = data.myId;
      const msg:string = data.value;
      const friendId = data.friendFind.id;
      // console.log(typeof(data.friendFind.id))
      const status:object = getStatusOfTowFriends(myId,friendId)
      // console.log(status)
      const status1:string = status.status1?.status ;
      const status2:string = status.status2?.status ;
      // console.log(status1);
      // console.log(`rooom ${roomName}`);
      // console.log(`id friend ${friendId}`);
      if(status1 && status2 && status1 === 'accepted' && status2 === 'accepted' ){
        const roomName = [myId,friendId].sort().join('_');
        socket.to(roomName).emit('receive_message', {msg,friendId});
      }
      // else{

      // }

    })
    
    socket.on('register',(newUser)=>{
      const newId:string =  insertNewUSer(newUser);
      socket.emit('registered',newId);
    })


    socket.on('joinToRoom',(roomName)=>{
      const rooms = socket.rooms;
      for(const room of rooms)
      {
        if(room != socket.id)
          socket.leave(room)
      }
      socket.join(roomName);
    })
    socket.on('get_friends',(user_id)=>{
      const friends =  getFriendsOfUser(user_id.id);
      socket.emit('friends_list',friends);
    })
    socket.on('status',(data)=>{
      changeStatusOfFriends(data);
      console.log(data.friend_id , data.user_id)
      const roomName = [data.user_id,data.friend_id].sort().join('_');
      const status:object = getStatusOfTowFriends(data.user_id,data.friend_id)

      // console.log(status)
      const status1:string = status.status1?.status ;
      const status2:string = status.status2?.status ;
      let statusGlobal:string = 'blocked';
      if(status1 && status2 && status1 === 'accepted' && status2 === 'accepted' )
        statusGlobal = 'accepted'
      io.emit('x',roomName,statusGlobal);
      // socket.emit('status_update',)//TODO 
    })
    socket.on('get_status',(data)=>{
      console.log(data.myId,data.friendId)
      const status:object = getStatusOfTowFriends(data.myId,data.friendId)
      console.log(status)
      const status1:string = status.status1?.status ;
      const status2:string = status.status2?.status ;
      let allow:Boolean = false ;
      if(status1 == undefined || status2 == undefined)
          allow = true
      if(status1 && status2 && status1 === 'accepted' && status2 === 'accepted' )
        allow = true;
      socket.emit('allowMsg',allow);
    })

    socket.on('get_last_user',()=>{
      const lastId:string = getLastUser()
      socket.emit('last_user',lastId)
    })
  });
});


await server.listen({port:3000});
console.log(`server run in port 3000`);
