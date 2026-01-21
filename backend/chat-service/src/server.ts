import {
  getAllMsg,
  changeToRecv,
  getWaitingMsg,
  saveMsg,
  changeAllToRecv,
  getTimeOfMsg,
  saveNotif,
  getNotif,
  changeDisplay,
  changeDisplayOneNotif,
  checkExistingNotification,
  updateNotificationStatus,
  deleteNotification,
  getNotificationID
} from "./db/database";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import cookie from "cookie";
import { fetchUserData, getStatusOfTowFriends, changeStatusOfFriends, getFriendsOfUser, updateUserStat } from "./fetchingData";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
const server = fastify({ logger: true });
server.register(fastifyIO, {
  path: "/socket.io",
  cors: {
    origin: "https://localhost:8443",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

export const onlineUsers = new Map<string, Set<string>>();

server.get('/online/:id', (req, res) => {
  const { id } = req.params as { id: string }
  if (onlineUsers.has(id)) {
    res.code(200).send({
      online: true,
      socketIds: Array.from(onlineUsers.get(id))
    });
  } else
    res.code(200).send({
      online: false,
      socketIds: []
    });

})
const getRoomName = (id1: string, id2: string): string => {
  return [id1, id2].sort().join("_");
};

// const chat = server.

server.ready().then(() => {
  const io = (server as any).io;
  io.on("connection", async (socket) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie ?? "");
    const token = cookies.token;
    if (!token) {
      socket.disconnect();
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId:string = String(decoded.id);
    if (!userId) {
      socket.disconnect();
      return;
    }
    socket.data.userId = userId;
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
      socket.broadcast.emit("user_online", userId);
      updateUserStat(userId, "online");
    }
    onlineUsers.get(userId)?.add(socket.id);
    console.log("--------------------------");
    console.log("New client connected, userId:", userId);
    console.log("size of onlineUsers", onlineUsers.size, "---->", onlineUsers);

    //###############################chat events##############################################
    socket.on("send_message", async (data) => {
      try {
        const id = socket.data.userId
        if (!id) return;
        const friendId: string = data?.friendId; //
        const msg: string = data?.value; //
        if (!friendId || !msg || typeof msg !== 'string' || msg.trim().length === 0 || msg.length > 1000)
          return;
        const roomName = getRoomName(id, friendId);
        const status: any = await getStatusOfTowFriends(id, friendId);
        if (status) {
          const status1: string = status?.status1?.status; //
          const status2: string = status?.status2?.status; //
          if (status1 === "accepted" && status2 === "accepted") {
            const notifId = await saveNotif(id, friendId, 'msg', msg);
            const friendSocketId = onlineUsers.get(friendId);
            const msgId: string = await saveMsg(id, friendId, msg, roomName, "waiting");
            const timeOfMsg: string = await getTimeOfMsg(msgId);
            const UserData = await fetchUserData(id); // get data of user from user-management service
            socket.to(roomName).emit("receive_message", msg, msgId, id, timeOfMsg, UserData?.user?.avatar_url);
            if (friendSocketId) {
              for (const ids of friendSocketId) {
                socket.to(ids).emit("live", id, roomName, msg, timeOfMsg);
                socket.to(ids).emit("msg_notification", UserData?.user?.username, msg, notifId);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error inside send_message:', err);
        socket.emit("chat_error", "Failed to send message");

      }
    });
    socket.on('get_messages', async (data) => {
      try {
        const userID = socket.data.userId;
        if (!userID || !data?.friendId) return;
        const roomName = getRoomName(userID, data.friendId);
        const limit = data.limit || 20;
        const offset = data.offset || 0;
        await changeAllToRecv(userID, roomName)
        await changeDisplay(userID)
        const messages = await getAllMsg(roomName, limit, offset);
        const UserData = await fetchUserData(data.friendId);
        socket.emit('messages_batch', messages.reverse(), UserData?.user?.avatar_url);
      } catch (err) {
        console.error('Error in get_messages:', err);
        socket.emit("chat_error", "Failed to get messages");
      }
    });
    socket.on('get_old_messages', async (data) => {
      try {
        const userID = socket.data.userId;
        if (!userID || !data?.friendId) return;
        const roomName = getRoomName(userID, data.friendId);
        const limit = data.limit || 20;
        const offset = data.offset || 0;
        await changeAllToRecv(userID, roomName)
        await changeDisplay(userID)
        const messages = await getAllMsg(roomName, limit, offset);
        const UserData = await fetchUserData(data.friendId);
        socket.emit('messages_old_batch', messages, UserData?.user?.avatar_url);
      } catch (err) {
        console.error('Error in get_old_messages:', err);
        socket.emit("chat_error", "Failed to get old messages");
      }
    });
    socket.on("get_friends", async () => {
      try {
        const id = socket.data.userId
        if (!id) return;
        const friends = await getFriendsOfUser(id);
        const waitingMsg = await getWaitingMsg(id);
        socket.emit("friends_list", { friends, waitingMsg });
      } catch (err) {
        console.error('Error in get_friends:', err);
        socket.emit("chat_error", "Failed to get friends list");
      }
    });
    socket.on("get_status", async (friendId) => {
      try {
        const id = socket.data.userId
        if (!id || !friendId) return;
        // const roomName = getRoomName(id, friendId);
        const status: any = await getStatusOfTowFriends(id, friendId);
        if (status) {
          const status1: string = status?.status1?.status;
          const status2: string = status?.status2?.status;
          let allow: Boolean = (status1 === "accepted" && status2 === "accepted");
          socket.emit("allowMsg", allow, status1);
          const userSocket = onlineUsers.get(id);
          if (userSocket) {
            for (const ids of userSocket) {
              io.to(ids).emit("blockBtn", status1);
            }
          }
        }
      } catch (err) {
        console.error('Error in get_status:', err);
        socket.emit("chat_error", "Failed to get status");
      }
    });
    socket.on("status", async (data) => {
      try {
        const id = socket.data.userId
        if (!id || !data?.friendId || !data?.status) return;
        const roomName = getRoomName(id, data.friendId);

        const status: any = await changeStatusOfFriends(data.status, id, data.friendId);
        if (status) {
          const status1: string = status?.status1?.status;
          const status2: string = status?.status2?.status;
          let statusGlobal: string = "blocked";
          if (status1 === "accepted" && status2 === "accepted")
            statusGlobal = "accepted";
          const userSocket = onlineUsers.get(id);
          const friendSocket = onlineUsers.get(data.friendId);

          if (userSocket) {
            for (const ids of userSocket) {
              io.to(ids).emit("blockOrAccepted", roomName, statusGlobal, status1);
            }
          }
          if (friendSocket) {
            for (const isd of friendSocket) {
              io.to(isd).emit("blockOrAccepted", roomName, statusGlobal, status2);
            }
          }
        }
      } catch (err) {
        console.error('Error in status:', err);
        socket.emit("chat_error", "Failed to change status");
      }
    });
    socket.on('ack_message', async (msgId: string) => {
      try {
        if (msgId) await changeToRecv(msgId); // update status to 'sent'
      } catch (e) {
        console.error("Error ack_message", e);
        socket.emit("chat_error", "Failed to acknowledge message");
      }
    });
    socket.on("joinToRoom", (roomName: string) => {
      try {
        if (!roomName) return;
        const rooms = socket.rooms;
        for (const room of rooms) {
          if (room != socket.id) socket.leave(room);
        }
        socket.join(roomName);
      } catch (err) {
        console.error('Error in joinToRoom:', err);
        socket.emit("chat_error", "Failed to join room");
      }
    });
    socket.on('challenge', async (friendId) => {
      try {
        if (!friendId) return;
        const id = socket.data.userId;
        if (!id) return;
        const notfId = await saveNotif(id, friendId, 'challenge', null);
        const friendSocket = onlineUsers.get(friendId);
        if (!friendSocket) return;
        const UserData = await fetchUserData(id);
        if (!UserData)
          return;
        for (const isd of friendSocket) {
          io.to(isd).emit("request_to_play", UserData?.user?.username, id, notfId);
        }

      } catch (err) {
        console.error('Error in challenge:', err);
        socket.emit("chat_error", "Failed to send challenge");
      }
    })
    //###############################notification events###########################################
    socket.on('accept_play', async (id, friendId) => {
      console.log(id, friendId);
    })
    socket.on('reject_play', async (id, friendId) => {
      try {
        if (!id || !friendId) return;
        const notifId = await saveNotif(id, friendId, 'reject', null);
        const Sockets = onlineUsers.get(friendId);
        if (!Sockets) return;
        const UserData = await fetchUserData(id);
        if (!UserData) return;
        for (const isd of Sockets) {
          io.to(isd).emit("not_agree", UserData?.user?.username, notifId);
        }

      } catch (err) {
        console.error('Error in reject_play:', err);
        socket.emit("chat_error", "Failed to send rejection");
      }
    })
    socket.on('getNotif', async (id) => {
      try {
        const data = await getNotif(id);
        socket.emit("notif", data);
      } catch (err) {
        console.error('Error in getNotif:', err);
      }
    })
    socket.on('friendRequestSent', async (myId: string, friendId: string) => {
      if (!myId || !friendId) return;
      const existingRequest =  checkExistingNotification(
        myId, 
        friendId, 
        'friendRequest', 
        'pending'
      );
      if (existingRequest) {
        socket.emit('error', 'Friend request already pending');
        return;
      }
      const notifId =  saveNotif(myId, friendId, 'friendRequest', 'pending') 
      
      const userSocket = onlineUsers.get(String(friendId));

        if (!userSocket) return;

        const UserData = await fetchUserData(myId);
        if (!UserData) return;
        for (const ids of userSocket) {

        socket.to(ids).emit("friendRequestReceived", 
          UserData.user.username, 
          friendId, 
          myId,
          notifId
        );
      }

    });
    socket.on('acceptFriendRequest', async (notifId:string,friendId:string,myId:string) => {
      try {
        if (!friendId || !myId) return;
        updateNotificationStatus(notifId, 'accepted');
        const friendSocket = onlineUsers.get(String(friendId));
        if (!friendSocket) return;
        const UserData = await fetchUserData(myId);
        if (!UserData)
          return;
        
        for (const isd of friendSocket) {
          socket.to(isd).emit("friendRequestAccepted", UserData?.user?.username, myId, friendId);
        }
      } catch (err) {
        console.error('Error in acceptFriendRequest:', err);
      }
    });
    socket.on('rejectFriendRequest', async (notifId:string,friendId:string,myId:string) => {
      if (!friendId || !myId) return;
      try {
        deleteNotification(notifId);
        const friendSocket = onlineUsers.get(String(friendId));
        if (!friendSocket) return;
        const UserData = await fetchUserData(myId);
        if (!UserData)
          return;
        for (const isd of friendSocket) {
          socket.to(isd).emit("friendRequestRejected", UserData?.user?.username, myId, friendId);
        }
      }
      catch (err) {
        console.error('Error in rejectFriendRequest:', err);
      }
    });
    socket.on("removeNotif", async (id: string) => {
      try {
        if (!id) return;
        await changeDisplayOneNotif(id);
      }
      catch (err) {
        console.error('Error in removeNotif:', err);
      }
    })
    socket.on('cancelFriendRequest', async ( receiverId: string,myId: string) => {
      if (!myId || !receiverId) return;
      const notifId =  getNotificationID(myId, receiverId, 'friendRequest');
    try {
      
        deleteNotification(notifId);

        const receiverSocket = onlineUsers.get(String(receiverId));
        if (receiverSocket) {
          for (const socketId of receiverSocket) {
            io.to(socketId).emit('friendRequestCancelled', { notifId });
          }
        }

      } catch (err) {
        console.error('Error cancelling friend request:', err);
        socket.emit('error', 'Failed to cancel friend request');
      }
    });
    socket.on("disconnect", () => {
      try {
        const id = socket.data.userId;
        if (id && onlineUsers.has(id)) {
          onlineUsers.get(id).delete(socket.id);
          if (onlineUsers.get(id)!.size === 0) {
            onlineUsers.delete(id);
            console.log("--------------------------");
            console.log("size of onlineUsers", onlineUsers.size, "---->", onlineUsers);
            socket.broadcast.emit("user_offline", id);
            updateUserStat(id, "offline");
          }
        }
        console.log("after this size of onlineUsers", onlineUsers.size);
      }
      catch (err) {
        console.error('Error in disconnect:', err);
      }
    });
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    // ************************************************************************************
    // ***************************        Tournament event     ****************************
    // ************************************************************************************

    socket.on("tournament:create", async (data) => {
      // console.log("tournament create event received", data);
      socket.join(data.room);

      // 4️⃣ Notify creator
      socket.emit("tournament:created", data);
    });




    socket.on("/tournamentjoin", async (data) => {
      // console.log("tournament join event received", data);
      socket.join(data.room);
      // console.log(`User joined ${data.room}`);
    });
    socket.on("/tournamentstart", async (data) => {

    });
    socket.on("/tournamentleave", async (data) => {

    });
  })
});

server.post('/notifytournament', async (request, reply) => {
  const { userids, type, data } = request.body as any;
  const io = (server as any).io;
  for (let id in userids) {

    const sockets = onlineUsers.get(id);
    if (sockets) {
      for (const socketId of sockets) {
        io.to(socketId).emit(type, data);
      }
    }
  }
  reply.code(200).send({ message: 'ALL is Good' });
});
async function startServer() {
  try {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log("chat Server running on port 3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

}
startServer();
export { server };