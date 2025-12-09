import { get } from "http";
import {
  getAllMsg,
  changeToRecv,
  getWaitingMsg,
  saveMsg,
  changeAllToRecv,
  getTimeOfMsg,
} from "./db/database";

import { fetchUserData, getStatusOfTowFriends,changeStatusOfFriends,getFriendsOfUser } from "./fetchingData";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify(/* { logger: true } */);
server.register(fastifyIO, {
  path: "/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

//TODO convert all ids to string
const onlineUsers = new Map<string, string>(); //TODO handel multiple tab
const statusOfTowFriend = new Map<string,object>();//TODO cash on time

server.ready().then(() => {
  const io = (server as any).io;

//   io.use(async (socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error("No token"));
//   console.log(token)

//   // const user = verifyToken(token); // JWT, or call auth microservice
  
//   // if (!user) return next(new Error("Invalid token"));
  
//   socket.data.userId = user.id;
//   next();
// });


  // io.use((socket, next) => {
  //   // Get user ID from handshake headers (set by nginx)
  //   const userId = socket.handshake.headers['x-user-id'];
  // const user = socket.handshake.headers['x-user'];
  //   console.log('User ID from headers:', userId);
  //   console.log('User Data from headers:', user);
  //   if (!userId) {
  //     return next(new Error('Authentication error'));
  //   }
    
  //   // Attach user data to socket
  //   socket.data.userId = userId;
  //   socket.data.user = user;
    
  //   next();
  // });

  // io.on("connection", async (socket) => {

  //   //get data of user on connection 
  //   socket.on("con", async(id) => {
  //     try{
  //       // const id: string = socket.data.userId;
  //       const datOfUser = await fetchUserData(id); // get data of user from user-management service
  //       onlineUsers.set(id, socket.id);
  //       socket.emit('setIMg',datOfUser.img)
  //       // console.log(Array.from(onlineUsers.entries()));
  //       // console.log('----------------------');
        
  //     }catch(err)
  //     {
  //       console.error('Error :', err);
  //     }
  //   });

  //   socket.on("send_message", async (data) => {
  //     try{
  //       const myId: string = data.myId; //
  //       const friendId: string = data.friendId; //
  //       // console.log(friendId);
  //       const msg: string = data.value; //
  //       const roomName = [myId, friendId].sort().join("_");
  //       if(!statusOfTowFriend.has(roomName))
  //       {
  //         const status:object = await getStatusOfTowFriends(myId, friendId);
  //         statusOfTowFriend.set(roomName,status);
  //       }
  //       const status:any = statusOfTowFriend.get(roomName);
  //       if(status){
  //         const status1: string = status.status1.status; //
  //         const status2: string = status.status2.status; //
  //         if (
  //           status1 &&
  //           status2 &&
  //           status1 === "accepted" &&
  //           status2 === "accepted"
  //         ) {
  //           const friendSocketId = onlineUsers.get(String(friendId));
  //           const msgId:string =  await saveMsg(myId, friendId, msg, roomName, "waiting");
  //           const timeOfMsg:string = getTimeOfMsg(msgId);

  //           const UserData = await fetchUserData(friendId); // get data of user from user-management service

  //           socket.to(roomName).emit("receive_message", msg, msgId ,myId,timeOfMsg,UserData);
  //           socket.to(friendSocketId).emit("live", myId, roomName, msg,timeOfMsg,UserData);
  //           // io.to(friendSocketId).emit("live", myId, roomName, msg);
  //         }
  //       }
  //     }catch(err){
  //       console.error('Error :', err);
  //     }
  //   });

  //   socket.on('ack_message', async(msgId:string) => {
  //     await changeToRecv(msgId); // update status to 'sent'
  //   });

  //   socket.on("joinToRoom", (roomName: string) => {
  //     try{
  //       const rooms = socket.rooms;
  //       for (const room of rooms) {
  //         if (room != socket.id) socket.leave(room);
  //       }
  //       socket.join(roomName);
  //     }catch(err)
  //     {
  //       console.error('Error in sendMsg:', err);
  //     }
  //   });

  //   socket.on("get_friends", async (id: string) => {
  //     try{
  //       const friends = await getFriendsOfUser(id);// get friends from user-management service
  //       const waitingMsg = await getWaitingMsg(id);
  //       console.table(waitingMsg)
  //       socket.emit("friends_list", { friends, waitingMsg });
  //     }catch(err)
  //     {
  //       console.error('Error in sendMsg:', err);
  //     }
  //   });

  //   socket.on("status", async (data) => {
  //     try{
  //       const roomName = [data.user_id, data.friend_id].sort().join("_");//room name 
  //       console.log("status data:", data);
  //       const newStatus:object = await changeStatusOfFriends(data.status, data.user_id, data.friend_id);// update status in database blocked/accepted
  //       if(statusOfTowFriend.has(roomName))
  //       {                    
  //         statusOfTowFriend.set(roomName,newStatus);
  //       }
  //       else(!statusOfTowFriend.has(roomName))
  //       {
  //         const status: object = await getStatusOfTowFriends(
  //           data.user_id,
  //           data.friend_id
  //         );
  //         statusOfTowFriend.set(roomName,status);
  //       }

  //       const status:any = statusOfTowFriend.get(roomName);
  //       if(status)
  //       {
  //         const status1: string = status?.status1?.status;
  //         const status2: string = status?.status2?.status;
  //         let statusGlobal: string = "blocked";
  //         if (
  //           status1 &&
  //           status2 &&
  //           status1 === "accepted" &&
  //           status2 === "accepted"
  //         )
  //           statusGlobal = "accepted";
  //         // io.emit("blockOrAccepted", roomName, statusGlobal);
  //         const userSocket = onlineUsers.get(data.user_id);
  //         const friendSocket = onlineUsers.get(data.friend_id);

  //         if (userSocket) io.to(userSocket).emit("blockOrAccepted", roomName, statusGlobal);
  //         if (friendSocket) io.to(friendSocket).emit("blockOrAccepted", roomName, statusGlobal);
  //       }
  //     }catch(err)
  //     {
  //       console.error('Error in sendMsg:', err);
  //     }
  //   });

  //   socket.on("get_status", async (data) => {
  //     try{

  //       const roomName = [data.myId, data.friendId].sort().join("_");
  //       if(!statusOfTowFriend.has(roomName))
  //       {
  //         const status: object = await getStatusOfTowFriends(
  //           data.myId,
  //           data.friendId
  //         );
  //         statusOfTowFriend.set(roomName,status);
  //       }
  //       const status:any = statusOfTowFriend.get(roomName);
  //       if(status)
  //       {
  //         const status1: string = status.status1?.status;
  //         const status2: string = status.status2?.status;
  //         let allow: Boolean = false;
  //         if (status1 == undefined || status2 == undefined) allow = true;
  //         if (
  //           status1 &&
  //           status2 &&
  //           status1 === "accepted" &&
  //           status2 === "accepted"
  //         )
  //         allow = true;
  //         socket.emit("allowMsg", allow);
  //       }
  //     }catch(err)
  //     {
  //       console.error('Error in sendMsg:', err);
  //     }
  //   });

  //   socket.on('get_messages', async (data) => {
  //       const roomName = [data.myId, data.friendId].sort().join('_');
  //       const limit = data.limit || 20;
  //       const offset = data.offset || 0;
  //       await changeAllToRecv(data.myId,roomName)
  //       const messages = await getAllMsg(roomName, limit, offset);
  //       const UserData = await fetchUserData(data.friendId); 
  //       // console.log('---------get all--------');
  //       // console.table(messages);
  //       // console.log('------------------------');

  //       socket.emit('messages_batch', messages.reverse(),UserData.img);
  //   });
  //   socket.on('get_old_messages', async (data) => {

  //       const roomName = [data.myId, data.friendId].sort().join('_');
  //       const limit = data.limit || 20;
  //       const offset = data.offset || 0;
  //       await changeAllToRecv(data.myId,roomName)
  //       const messages = await getAllMsg(roomName, limit, offset);
  //       const UserData = await fetchUserData(data.friendId); 

  //       // console.table(messages);
  //       // console.log('---------get old--------');
  //       // console.table(data);
  //       // console.log('------------------------');
  //       socket.emit('messages_old_batch', messages,UserData.img);
  //   });

  //   socket.on("disconnect", () => {
  //     try{
  //       const userId = socket.data.userId;
  //       if (userId && onlineUsers.get(userId) === socket.id)
  //         onlineUsers.delete(userId);
  //     }catch(err)
  //     {
  //       console.error('Error in sendMsg:', err);
  //     }
  //   });
  // });

  io.on("connection", async (socket) => {
    socket.on('con',async (id)=>{
        socket.data.userId = id;
        onlineUsers.set(id, socket.id);
        // const id_friend  = "1"; //TODO remove this hardcoded value
        // const userData = await fetchUserData(id);
        // console.log('User connected:', userData);
        // const userFriends = await getFriendsOfUser(id);
        // console.log('User friends:', userFriends);
        // const friendsStatus = await getStatusOfTowFriends(id,id_friend);
        // console.log('Friends status:', friendsStatus);
        // const changeStatus = await changeStatusOfFriends('blocked',id,id_friend);
        // console.log('Changed status:', changeStatus);
        
    })
    socket.on("send_message", async (data) => {
      try{
        // console.log("in msg",data)
          const id = socket.data.userId
          const friendId: string = data.friendId; //
          const msg: string = data.value; //
          const roomName = [id, friendId].sort().join("_");
          if(!statusOfTowFriend.has(roomName))
          {
            const status:object = await getStatusOfTowFriends(id, friendId);
            statusOfTowFriend.set(roomName,status);
          }
          const status:any = statusOfTowFriend.get(roomName);
          if(status){
            const status1: string = status.status1.status; //
            const status2: string = status.status2.status; //
            if (status1 === "accepted" && status2 === "accepted")
            {
              const friendSocketId = onlineUsers.get(String(friendId));
              const msgId:string =  await saveMsg(id, friendId, msg, roomName, "waiting");
              const timeOfMsg:string = await getTimeOfMsg(msgId);
              const UserData = await fetchUserData(friendId); // get data of user from user-management service
              socket.to(roomName).emit("receive_message", msg, msgId ,id,timeOfMsg,UserData);
              if(friendSocketId)socket.to(friendSocketId).emit("live", id, roomName, msg,timeOfMsg,UserData);
            }
          }
      }catch(err){
        console.error('Error :', err);
      }
    });
    socket.on('get_messages', async (data) => {
        const roomName = [data.myId, data.friendId].sort().join('_');
        const limit = data.limit || 20;
        const offset = data.offset || 0;
        await changeAllToRecv(data.myId,roomName)
        const messages = await getAllMsg(roomName, limit, offset);
        const UserData = await fetchUserData(data.friendId); 
        // console.log('---------get all--------');
        // console.table(messages);
        // console.log('------------------------');
        socket.emit('messages_batch', messages.reverse(),UserData.img);
    });
    socket.on('get_old_messages', async (data) => {
        const roomName = [data.myId, data.friendId].sort().join('_');
        const limit = data.limit || 20;
        const offset = data.offset || 0;
        await changeAllToRecv(data.myId,roomName)
        const messages = await getAllMsg(roomName, limit, offset);
        const UserData = await fetchUserData(data.friendId); 

        // console.table(messages);
        // console.log('---------get old--------');
        // console.table(data);
        // console.log('------------------------');
        socket.emit('messages_old_batch', messages,UserData.img);
    });
    socket.on("get_friends", async() => {
      try{
        const id = socket.data.userId
        const friends = await getFriendsOfUser(id);
        const waitingMsg = await getWaitingMsg(id);
        socket.emit("friends_list", { friends, waitingMsg });
      }catch(err)
      {
        console.error('Error in sendMsg:', err);
      }
    });
    socket.on("get_status", async (friendId) => {
      try{
        const id = socket.data.userId
        const roomName = [id, friendId].sort().join("_");
        if(!statusOfTowFriend.has(roomName))
        {
          const status: object = await getStatusOfTowFriends(id,friendId);
          
          statusOfTowFriend.set(roomName,status);
        }
        const status:any = statusOfTowFriend.get(roomName);
        if(status)
        {
          const status1: string = status.status1.status;
          const status2: string = status.status2.status;
          let allow: Boolean = false;
          if (status1 === "accepted" &&status2 === "accepted")
                allow = true;
          socket.emit("allowMsg", allow);
        }
      }catch(err)
      {
        console.error('Error in sendMsg:', err);
      }
    });
    socket.on("status", async (data) => {
      try{
        const id = socket.data.userId
        const roomName = [id, data.friendId].sort().join("_");//room name 
        const newStatus:object = await changeStatusOfFriends(data.status, id, data.friendId);// update status in database blocked/accepted
        // console.log("newStatus",newStatus)
        if(statusOfTowFriend.has(roomName))
        {                    
          statusOfTowFriend.set(roomName,newStatus);
        }
        else(!statusOfTowFriend.has(roomName))
        {
          const status: object = await getStatusOfTowFriends(id,data.friendId);
          // console.log("status fetched:", status);
          statusOfTowFriend.set(roomName,status);
        }

        const status:any = statusOfTowFriend.get(roomName);
        if(status)
        {
          const status1: string = status.status1.status;
          const status2: string = status.status2.status;
          let statusGlobal: string = "blocked";
          if (status1 === "accepted" && status2 === "accepted")
            statusGlobal = "accepted";
          const userSocket = onlineUsers.get(id);
          const friendSocket = onlineUsers.get(data.friendId);
          // console.log(userSocket,friendSocket)
          if (userSocket) io.to(userSocket).emit("blockOrAccepted", roomName, statusGlobal);
          if (friendSocket) io.to(friendSocket).emit("blockOrAccepted", roomName, statusGlobal);
        }
      }catch(err)
      {
        console.error('Error in sendMsg:', err);
      }
    });
    socket.on('ack_message', async(msgId:string) => {
      await changeToRecv(msgId); // update status to 'sent'
    });
    socket.on("joinToRoom", (roomName: string) => {
      try{
        const rooms = socket.rooms;
        for (const room of rooms) {
          if (room != socket.id) socket.leave(room);
        }
        socket.join(roomName);
      }catch(err)
      {
        console.error('Error in sendMsg:', err);
      }
    });
    socket.on("disconnect", () => {
      try{
        const id = socket.data.userId;
        if (id && onlineUsers.get(id) === socket.id)
          onlineUsers.delete(id);
      }catch(err)
      {
        console.error('Error in sendMsg:', err);
      }
    });
  })
});

async function startServer() {
  await server.listen({ port: 3000, host: '0.0.0.0' });
  
  console.log("Server running on 0.0.0.0:3000");
}

startServer();
