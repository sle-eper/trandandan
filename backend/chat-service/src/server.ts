import {
  getAllMsg,
  changeToRecv,
  getWaitingMsg,
  saveMsg,
  changeAllToRecv,
  getTimeOfMsg,
  saveNotif,
  getNotif
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

export const onlineUsers = new Map<string, Set<string>>();

server.get('/online/:id',(req,res)=>{
  const {id}  = req.params as {id:string}
  if(onlineUsers.has(id))
  {
    res.code(200).send({
      online: true,
      socketIds :Array.from(onlineUsers.get(id))
    });
  }else
    res.code(200).send({
      online: false,
      socketIds:[]
    });

})
const getRoomName = (id1: string, id2: string): string => {
  return [id1, id2].sort().join("_");
};

// const statusOfTowFriend = new Map<string,object>();//TODO cash on time

server.ready().then(() => {
  const io = (server as any).io;
  io.on("connection", async (socket) => {
    socket.on('con',async (id)=>{
        if(!id)
            return;
        const stringId:string = String(id)
        socket.data.userId = stringId;
        if(!onlineUsers.has(stringId))
        {
          onlineUsers.set(String(id), new Set());;
        }
        onlineUsers.get(stringId)?.add(socket.id)
        console.log(id ,"is connected");
        console.log(onlineUsers.size ,"size of online");
    })
    socket.on("send_message", async (data) => {
      try{
          const id = socket.data.userId
          if (!id) return;
          const friendId: string = data?.friendId; //
          const msg: string = data?.value; //
          if (!friendId || !msg || typeof msg !== 'string' || msg.trim().length === 0 || msg.length > 1000)
            return; 
          const roomName = getRoomName(id,friendId);
          // if(!statusOfTowFriend.has(roomName))
          // {
          //   const status:object = await getStatusOfTowFriends(id, friendId);
          //   console.log(status)
          //   statusOfTowFriend.set(roomName,status);
          // }
          const status:any = await getStatusOfTowFriends(id, friendId);
          if(status){
            const status1: string = status?.status1?.status; //
            const status2: string = status?.status2?.status; //
            if (status1 === "accepted" && status2 === "accepted")
            {
              await saveNotif(id,friendId,'msg',msg);
              const friendSocketId = onlineUsers.get(friendId);
              // console.log("content",onlineUsers)
              // console.log("id",friendId)
              // console.log("target",onlineUsers.get(friendId))
              const msgId:string =  await saveMsg(id, friendId, msg, roomName, "waiting");//TODO had lheblat dyal hena khas ytsayebo
              const timeOfMsg:string = await getTimeOfMsg(msgId);
              const UserData = await fetchUserData(friendId); // get data of user from user-management service
              socket.to(roomName).emit("receive_message", msg, msgId ,id,timeOfMsg,UserData.user.avatar_url);
              if(friendSocketId)
              {
                for(const ids of friendSocketId)
                {
                  // msg_notification
                  socket.to(ids).emit("live", id, roomName, msg,timeOfMsg);
                  socket.to(ids).emit("msg_notification", UserData.user.username,msg);
                }
              }
            }
          }
      }catch(err){
        console.error('Error inside send_message:', err);
      }
    });
    socket.on('get_messages', async (data) => {
      try{
        if (!data?.myId || !data?.friendId) return;
        const roomName = getRoomName(data.myId,data.friendId);
        const limit = data.limit || 20;
        const offset = data.offset || 0;
        await changeAllToRecv(data.myId,roomName)
        const messages = await getAllMsg(roomName, limit, offset);
        const UserData = await fetchUserData(data.friendId);
        socket.emit('messages_batch', messages.reverse(),UserData?.user.avatar_url);
      }catch(err)
      {
        console.error('Error in get_messages:', err);
      }
    });
    socket.on('get_old_messages', async (data) => {
      try{
        if (!data?.myId || !data?.friendId) return;
        const roomName = getRoomName(data.myId, data.friendId);
        const limit = data.limit || 20;
        const offset = data.offset || 0;
        await changeAllToRecv(data.myId,roomName)
        const messages = await getAllMsg(roomName, limit, offset);
        const UserData = await fetchUserData(data.friendId); 
        socket.emit('messages_old_batch', messages,UserData?.avatar_url);
      }catch(err){
        console.error('Error in get_old_messages:', err);
      }
    });
    socket.on("get_friends", async() => {
      try{
        // console.log("im her1");
        const id = socket.data.userId
        // console.log(id);
        if (!id) return;
        // console.log("im her2");
        const friends = await getFriendsOfUser(id);
        // console.log(friends)
        const waitingMsg = await getWaitingMsg(id);
        socket.emit("friends_list", { friends, waitingMsg });
      }catch(err)
      {
        console.error('Error in get_friends:', err);
      }
    });
    socket.on("get_status", async (friendId) => {
      try{
        const id = socket.data.userId
        if (!id || !friendId) return;
        const roomName = getRoomName(id, friendId);
        // if(!statusOfTowFriend.has(roomName))
        // {
        //   const status: object = await getStatusOfTowFriends(id,friendId);
          
        //   statusOfTowFriend.set(roomName,status);
        // }
        const status:any = await getStatusOfTowFriends(id,friendId);
        if(status)
        {
          const status1: string = status?.status1?.status;
          const status2: string = status?.status2?.status;
          let allow: Boolean = (status1 === "accepted" && status2 === "accepted");
          // if (status1 === "accepted" &&status2 === "accepted")
          //       allow = true;
          socket.emit("allowMsg", allow);
          const userSocket = onlineUsers.get(id);
          if(userSocket)
          {
            for(const ids of userSocket)
            {
              io.to(ids).emit("blockBtn",status1);
            }
          }
        }
      }catch(err)
      {
        console.error('Error in get_status:', err);
      }
    });
    socket.on("status", async (data) => {
      try{
        const id = socket.data.userId
        if (!id || !data?.friendId || !data?.status) return;
        const roomName = getRoomName(id, data.friendId);
        // const newStatus:object = await changeStatusOfFriends(data.status, id, data.friendId);// update status in database blocked/accepted
        // console.log("newStatus",newStatus)
        // if(statusOfTowFriend.has(roomName))
        // {                    
        //   statusOfTowFriend.set(roomName,newStatus);
        // }
        // else(!statusOfTowFriend.has(roomName))
        // {
        //   const status: object = await getStatusOfTowFriends(id,data.friendId);
        //   // console.log("status fetched:", status);
        //   statusOfTowFriend.set(roomName,status);
        // }

        const status:any = await changeStatusOfFriends(data.status, id, data.friendId);// update status in database blocked/accepted
        if(status)
        {
          const status1: string = status?.status1?.status;
          const status2: string = status?.status2?.status;
          let statusGlobal: string = "blocked";
          if (status1 === "accepted" && status2 === "accepted")
            statusGlobal = "accepted";
          const userSocket = onlineUsers.get(id);
          const friendSocket = onlineUsers.get(data.friendId);
          if(userSocket)
          {
            for(const ids of userSocket)
            {
              io.to(ids).emit("blockOrAccepted", roomName, statusGlobal);
            }
          }
          if(friendSocket)
          {
            for(const isd of friendSocket)
            {
              io.to(isd).emit("blockOrAccepted", roomName, statusGlobal);
            }
          }
        }
      }catch(err)
      {
        console.error('Error in status:', err);
      }
    });
    socket.on('ack_message', async(msgId:string) => {
      try {
          if(msgId) await changeToRecv(msgId); // update status to 'sent'
      } catch (e) {
          console.error("Error ack_message", e);
      }
      // await changeToRecv(msgId); // update status to 'sent'
    });

    socket.on("joinToRoom", (roomName: string) => {
      try{
        if (!roomName) return;
        const rooms = socket.rooms;
        for (const room of rooms) {
          if (room != socket.id) socket.leave(room);
        }
        socket.join(roomName);
      }catch(err)
      {
        console.error('Error in joinToRoom:', err);
      }
    });
    socket.on('challenge',async(friendId)=>{
      try{
        if (!friendId) return;
        const id = socket.data.userId;
        if(!id) return;
        const friendSocket = onlineUsers.get(friendId);
        await saveNotif(id,friendId,'challenge',null);
        // console.log("sasaasasasa");
        // console.log(friendSocket);
        if(!friendSocket)return;
        const UserData = await fetchUserData(id); 
        if(!UserData)
          return;
        // console.log(UserData.user.username);
        // const username;
        // if(UserData)
        // await saveNotif(id,friendId,'challenge',null);
        // console.log("sasaasasasa");
        for(const isd of friendSocket)
        {
          io.to(isd).emit("request_to_play",UserData?.user?.username,id);
        }
        
      }catch(err)
      {
        console.error('Error in challenge:', err);
      }
    })
    socket.on('accept_play',async(id,friendId)=>{
      console.log(id,friendId);
    })
    socket.on('reject_play',async(id,friendId)=>{
      try{
        if(!id || !friendId)return;
        await saveNotif(id,friendId,'reject',null);
        const Sockets = onlineUsers.get(friendId);
        if(!Sockets)return;
        const UserData = await fetchUserData(id); 
        if(!UserData)return;
        for(const isd of Sockets)
        {
          io.to(isd).emit("not_agree",UserData?.user?.username);
        }

      }catch(err)
      {
        console.error('Error in reject_play:', err);
      }
    })
    socket.on('getNotif',async(id)=>{
      try{
        // const id = socket.data.userId;
        // console.log("wa3333",id)
        const data = await getNotif(id);
        console.log("dakchi li kaytsift",data);
        socket.emit("notif",data);
      }catch(err){
        console.error('Error in getNotif:', err);
      }
    })

    socket.on("disconnect", () => {
      try{
        const id = socket.data.userId;
        if (id && onlineUsers.has(id))
        {
          onlineUsers.get(id).delete(socket.id);
          if (onlineUsers.get(id)!.size === 0) {
              onlineUsers.delete(id);
          }
        }
      }
      catch(err)
      {
        console.error('Error in disconnect:', err);
      }
    });
    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
  })
});

async function startServer() {
  try{
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log("chat Server running on port 3000");
  }catch(err)
  {
    server.log.error(err);
    process.exit(1);
  }
  
}

startServer();
