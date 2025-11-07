
import {getAllMsg,changeToRecv,getFriendsOfUser,getWaitingMsg,changeStatusOfFriends,getStatusOfTowFriends,insertNewUSer,getLastUser,saveMsg, getMyId} from "./src/db/database.ts"


import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { Socket } from "socket.io";

const server = fastify();
server.register(fastifyIO,{
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});





const onlineUsers = new Map <string, string>();

server.ready().then(() => {
  const io = server.io;
  io.on("connection", (socket) => {

    socket.on('con',(id:string)=>{
      socket.userId = id;
      onlineUsers.set(id,socket.id);
      console.log(Array.from(onlineUsers.entries()));
      console.log('----------------------');
    })
    socket.on('send_message',async  (data)=>{
    // console.log(Array.from(onlineUsers.entries()));
    // console.log('----------------------');

      const myId:string = data.myId;//
      const friendId:number = data.friendId;//
      console.log(friendId);
      const msg:string = data.value;//
      const status:object = await getStatusOfTowFriends(myId,friendId)//TODO had part khasha tsayeb ktar bach mayb9ach kola mera ymchi l db f kola msg
      const status1:string = status.status1?.status ;//
      const status2:string = status.status2?.status ;//
      const roomName = [myId,friendId].sort().join('_');
      // console.log(roomName);

      if(status1 && status2 && status1 === 'accepted' && status2 === 'accepted' ){
        const friendSocketId = onlineUsers.get(String(friendId))
        // if(friendSocketId)
        // {
          await  saveMsg(myId,friendId,msg,roomName,'waiting');
          socket.to(roomName).emit('receive_message', msg,myId);
          socket.to(friendSocketId).emit('cc',myId,roomName);
        // }
        // else{
        //   await saveMsg(myId,friendId,msg,roomName,'waiting');
        // }        
      }
      // await saveMsg(myId,friendId,msg,roomName,'waiting');//TODO hadi dyal lheblat ila kan dayer lik block ola makanch 3echirk
    })
    
    // socket.on('register',async(newUser)=>{
    //   const newId:string = await insertNewUSer(newUser);
    //   socket.emit('registered',newId);
    // })


    socket.on('joinToRoom',(roomName:string)=>{
      const rooms = socket.rooms;
      for(const room of rooms)
      {
        if(room != socket.id)
          socket.leave(room)
      }
      // document.getElementById(`counter-of-${roomName}`).innerHTML = '0';
     
      socket.join(roomName);
    })


    socket.on('get_friends',async (id:string)=>{
      const friends =  await getFriendsOfUser(id);
      // socket.userId = id;
      // console.log(socket.userId,typeof(socket.userId));
      // onlineUsers.set(id,socket.id);
      const waitingMsg = await getWaitingMsg(id);
      // console.table(waitingMsg);
      // console.table(typeof(waitingMsg));
      socket.emit('friends_list',{friends,waitingMsg});
    })


    socket.on('status',async (data)=>{
      await changeStatusOfFriends(data);
      // console.log(data.friend_id , data.user_id)
      const roomName = [data.user_id,data.friend_id].sort().join('_');
      const status:object = await getStatusOfTowFriends(data.user_id,data.friend_id)
      const status1:string = status.status1?.status ;
      const status2:string = status.status2?.status ;
      let statusGlobal:string = 'blocked';
      if(status1 && status2 && status1 === 'accepted' && status2 === 'accepted' )
        statusGlobal = 'accepted'
      io.emit('x',roomName,statusGlobal); 
    })


    socket.on('get_status',async(data)=>{
      const roomName = [data.myId,data.friendId].sort().join('_');
      const status:object = await getStatusOfTowFriends(data.myId,data.friendId)
      const status1:string = status.status1?.status ;
      const status2:string = status.status2?.status ;
      let allow:Boolean = false ;
      if(status1 == undefined || status2 == undefined)
          allow = true
      if(status1 && status2 && status1 === 'accepted' && status2 === 'accepted' )
        allow = true;
      socket.emit('allowMsg',allow);
      const allMsg = await getAllMsg(roomName)
      // const waitingMsg = await getWaitingMsg(data.myId);
      // console.table(waitingMsg);
      // socket.emit('unreadMsg',waitingMsg)
      for(const msg of allMsg)
      {
        if(msg.status === 'waiting')
          await changeToRecv(msg.id);
        if(msg.send == data.myId)
          io.to(socket.id).emit('aji_message',msg.msg)
        else
          io.to(socket.id).emit('receive_message', msg.msg);
      }
      // console.log(allMsg); 
      // console.log('------------------');
      // const recoveredMag = await getWaitingMsg(roomName,data.myId)
      // for(const msg of recoveredMag)
      // {
      //   await changeToRecv(msg.id)
        // io.to(socket.id).emit('receive_message', msg.msg);
      // }
    })

    socket.on('get_last_user',async ()=>{
      const lastId:string = await getLastUser()
      socket.emit('last_user',lastId)
    })
    socket.on('disconnect',()=>{
      // console.log(socket.userId,typeof(socket.userId));
      onlineUsers.delete(socket.userId)
    })
  });
});


await server.listen({port:3000});
console.log(`server run in port 3000`);
