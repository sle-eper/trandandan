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
    // origin: "https://localhost:8443",
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  }
});

export const onlineUsers = new Map<string, Set<string>>();
const tournamentTimeouts = new Map<string, NodeJS.Timeout>();

// let UserData ;
const getRoomName = (id1: string, id2: string): string => {
  return [id1, id2].sort().join("_");
};


// socket.on ==> m3a nefs socket
// socket.emit ===> m3a nefs socket 
// socket.broadcast.emit ===> m3a kelchi ila had socket 
// io.emit ===> kolchi 
// io.to(socketId).emit ===> had socket bedabet 
// socket.to(room).emit ===> kolchi f room ila hada 
// io.to(room).emit ===> kolchi li f room 

server.ready().then(() => {
  const io = (server as any).io;
  io.on("connection", async (socket) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie ?? "");
      const token = cookies.token;
      console.log("------------------------", token)
      if (!token) {
        socket.disconnect();
        return;
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId: string = String(decoded.id);
      if (!userId) {
        socket.disconnect();
        return;
      }
      socket.data.user = (await fetchUserData(userId, "server"))?.user;
      if (!socket.data.user) {
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
    } catch (err) {
      console.error('Error inside log:', err);
      socket.emit("chat_error", "Failed to log");
    }

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
            // const UserData = await fetchUserData(id); // get data of user from user-management service
            if (!socket.data.user) return
            socket.to(roomName).emit("receive_message", msg, msgId, id, timeOfMsg, socket.data.user.avatar_url);
            if (friendSocketId) {
              for (const ids of friendSocketId) {
                socket.to(ids).emit("live", id, roomName, msg, timeOfMsg);
                socket.to(ids).emit("msg_notification", socket.data.user.username, msg, notifId);
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
        const UserData = await fetchUserData(data.friendId, "get_messages");
        if (!UserData || !messages) return;
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
        const UserData = await fetchUserData(data.friendId, "get_old_messages");
        if (!messages || !UserData) return;
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

    socket.on('challenge', async (friendIdInput) => {
      try {
        if (!friendIdInput) return;
        const friendId = String(friendIdInput);
        const id = socket.data.userId;
        if (!id) return;
        const notfId = await saveNotif(id, friendId, 'challenge', null);
        const friendSocket = onlineUsers.get(friendId);
        if (!friendSocket) return;
        // const UserData = await fetchUserData(id);
        if (!socket.data.user) return
        for (const isd of friendSocket) {
          io.to(isd).emit("request_to_play", socket.data.user.username, id, notfId);
        }

      } catch (err) {
        console.error('Error in challenge:', err);
        socket.emit("chat_error", "Failed to send challenge");
      }
    })
    socket.on('accept_play', async (idInput, friendIdInput) => {
      try {
        if (!idInput || !friendIdInput) return;
        const id = String(idInput);
        const friendId = String(friendIdInput);
        const gameId = Math.random().toString(36).substring(2, 9);

        // Notify both players to start the game
        const challengerSockets = onlineUsers.get(friendId);
        const acceptorSockets = onlineUsers.get(id);

        if (challengerSockets) {
          for (const sid of challengerSockets) {
            io.to(sid).emit("start_game", { gameId, side: 'left' });
          }
        }
        if (acceptorSockets) {
          for (const sid of acceptorSockets) {
            io.to(sid).emit("start_game", { gameId, side: 'right' });
          }
        }
        console.log(`[GAME] Match accepted: ${gameId} between ${id} and ${friendId}`);
      } catch (err) {
        console.error('Error in accept_play:', err);
      }
    })
    socket.on('reject_play', async (idInput, friendIdInput) => {
      try {
        if (!idInput || !friendIdInput) return;
        const id = String(idInput);
        const friendId = String(friendIdInput);
        const notifId = await saveNotif(id, friendId, 'reject', null);
        const Sockets = onlineUsers.get(friendId);
        if (!Sockets || !socket.data.user) return;
        // const UserData = await fetchUserData(id);
        // if (!UserData) return;
        for (const isd of Sockets) {
          io.to(isd).emit("not_agree", socket.data.user.username, notifId);
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
      const existingRequest = checkExistingNotification(
        myId,
        friendId,
        'friendRequest',
        'pending'
      );
      if (existingRequest) {
        socket.emit('error', 'Friend request already pending');
        return;
      }
      const notifId = saveNotif(myId, friendId, 'friendRequest', 'pending')

      const userSocket = onlineUsers.get(String(friendId));

      if (!userSocket) return;

      // const UserData = await fetchUserData(myId);
      // if (!UserData) return;
      if (!socket.data.user) return
      for (const ids of userSocket) {
        console.log("//////////////////user data", socket.data.user);
        console.log("+++++++++++++++++++++++Sending friendRequestReceived to", socket.data.user.username, friendId, myId, notifId);
        socket.to(ids).emit("friendRequestReceived",
          socket.data.user.username,
          friendId,
          myId,
          notifId
        );
      }

    });
    socket.on('acceptFriendRequest', async (notifId: string, friendId: string, myId: string) => {
      try {
        if (!friendId || !myId) return;
        updateNotificationStatus(notifId, 'accepted');
        const friendSocket = onlineUsers.get(String(friendId));
        if (!friendSocket) return;

        // const UserData = await fetchUserData(myId);
        // if (!UserData)
        //   return;
        if (!socket.data.user) return
        for (const isd of friendSocket) {
          socket.to(isd).emit("friendRequestAccepted", socket.data.user.username, myId, friendId);
        }
      } catch (err) {
        console.error('Error in acceptFriendRequest:', err);
      }
    });
    socket.on('rejectFriendRequest', async (notifId: string, friendId: string, myId: string) => {
      if (!friendId || !myId) return;
      try {
        deleteNotification(notifId);
        const friendSocket = onlineUsers.get(String(friendId));
        if (!friendSocket) return;
        // const UserData = await fetchUserData(myId);
        // if (!UserData)
        //   return;
        if (!socket.data.user) return
        for (const isd of friendSocket) {
          socket.to(isd).emit("friendRequestRejected", socket.data.user.username, myId, friendId);
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

    socket.on('cancelFriendRequest', async (receiverId: string, myId: string) => {
      if (!myId || !receiverId) return;
      const notifId = getNotificationID(myId, receiverId, 'friendRequest');
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
      socket.emit("tournament:created", data);
    });
    socket.on("tournament:invite", async (data) => {
      const friendSocket = onlineUsers.get(data.friendId);
      const notfId = await saveNotif(data.userId, data.friendId, 'challenge', null);
      if (friendSocket) {
        for (const isd of friendSocket) {
          io.to(isd).emit("TournamentInvitation", {
            tournamentName: data.tournamentName,
            userId: data.userId,
            friendId: data.friendId,
            notfId: notfId
          });
        }
      }
      socket.emit("InvitationSended");
    });
    socket.on("tournament:join", async (data) => {
      socket.join(data.tournamentName);
      socket.emit("tournament:joined", data);
    });
    socket.on("matchmaking:start", async (data) => {
      const participantsMatching = await fetch(`http://tournament:5500/Tournament/matchmaking?tournamentName=${encodeURIComponent(data.tournamentName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      )
      await fetch(`http://tournament:5500/Tournament/updateStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournamentName: data.tournamentName,
          status: 'playing'
        }),
      }
      )
      const participantsMatchingJson = await participantsMatching.json();
      for (const match of participantsMatchingJson.matches) {
        const player1 = match.player1;
        const player2 = match.player2;
        const gameId = Math.random().toString(36).substring(2, 9);
        const player1Sockets = onlineUsers.get(String(player1.userid));
        const player2Sockets = onlineUsers.get(String(player2.userid));
        if (player1Sockets) {
          for (const sid of player1Sockets) {
            io.to(sid).emit("start_gameTournament", { gameId, userId: player1.userid, tournamentName: data.tournamentName, maxPlayers: data.maxPlayers, matches: participantsMatchingJson.matches });

          }
        }
        if (player2Sockets) {
          for (const sid of player2Sockets) {
            io.to(sid).emit("start_gameTournament", { gameId, userId: player2.userid, tournamentName: data.tournamentName, maxPlayers: data.maxPlayers, matches: participantsMatchingJson.matches });
          }
        }
      }

    });
    socket.on("game:tournament:joined", async (data) => {
      socket.join(data.gameId);
      const room = io.sockets.adapter.rooms.get(data.gameId);
      if (room && room.size === 2) {
        const existingTimeout = tournamentTimeouts.get(data.gameId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          tournamentTimeouts.delete(data.gameId);
        }
        io.to(data.gameId).emit("tournament:bracket", {tournamentName: data.tournamentName});
        setTimeout(() => {
          const sidArray = Array.from(room);
          const [sid1, sid2] = sidArray;
          const gameId = data.gameId;
          io.to(sid1).emit("matchTournament", { gameId, side: 'right', flagTournament: true, tournamentName: data.tournamentName });
          io.to(sid2).emit("matchTournament", { gameId, side: 'left', flagTournament: true, tournamentName: data.tournamentName });

        }, 10000);
      } else {
        setTimeout(() => {
          const room = io.sockets.adapter.rooms.get(data.gameId);
          if (room && room.size === 1) {
            socket.emit("match:ended", {
              userid: socket.data.userId,
              result: 'win',
              message: 'Opponent did not join in time. You win by default.',
              tournamentName: data.tournamentName
            });
            socket.leave(data.gameId);
            tournamentTimeouts.delete(data.gameId);
          }
        }, 40000);
      }
    });
    socket.on("Tournament:leave", async (data) => {
      const room = io.sockets.adapter.rooms.get(data.gameId);
      if (room && room.size === 1) {
        const sidArray = Array.from(room);
        const sid = sidArray[0];
        io.to(sid).emit("match:ended", {
          userid: socket.data.userId,
          result: 'won',
          message: 'Opponent left the tournament game. You win by default.',
          tournamentName: data.tournamentName
        });
        //redirect to home 
      }
    });
    socket.on("tournament:Goo", async (data) => {
      const winnerId = data.winnerId;
      const tournamentName = data.tournamentName;
      const winnerSockets = onlineUsers.get(String(winnerId));
      if (winnerSockets) {
        for (const sid of winnerSockets) {
          io.to(sid).emit("tournament:champion", {
            message: `👑🎉 Tournament ${data.tournamentName} Champion 🎉🏆`,
            tournamentName: tournamentName
          });
        }
      }
      const loserId = data.loserId;
      const loserSockets = onlineUsers.get(String(loserId));
      if (loserSockets) {
        for (const sid of loserSockets) {
          io.to(sid).emit("tournament:champion", {
            message: `The tournament ${tournamentName} has concluded. Better luck next time!`,
            tournamentName: tournamentName
          });
        }
      }
    });
    socket.on("match:result", async (data) => {
      const loser = data.loserId;
      const winner = data.winnerId;
      if (data.final === 'final') {

        const winnerSockets = onlineUsers.get(String(winner));
        const loserSockets = onlineUsers.get(String(loser));

        if (winnerSockets) {
          for (const sid of winnerSockets) {
            io.to(sid).emit("tournament:finalResult", data);
          }
        }

        if (loserSockets) {
          for (const sid of loserSockets) {
            io.to(sid).emit("tournament:finalResult", data);
          }
        }

        return;
      }
      const loserSockets = onlineUsers.get(String(loser));
      const winnerSockets = onlineUsers.get(String(winner));
      if (loserSockets) {
        for (const sid of loserSockets) {
          io.to(sid).emit("match:ended", {
            result: 'lost',
            tournamentName: data.tournamentName
          });
        }
      }
      if (winnerSockets) {
        for (const sid of winnerSockets) {
          io.to(sid).emit("match:ended", {
            userid: winner,
            result: 'won',
            tournamentName: data.tournamentName
          });
        }
      }
    });

    socket.on("tournament:Final", async (data) => {
      const tournamentName = data.tournamentName;
      const finalMatchResponse = await fetch(`http://tournament:5500/Tournament/finalMatch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tournamentName: tournamentName, winnerId: socket.data.userId }),
      });
      const finalMatch = await fetch(`http://tournament:5500/Tournament/finalMatch?tournamentName=${encodeURIComponent(tournamentName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const finalMatchJson = await finalMatch.json();
      console.log("{DEBUG} final match response:", finalMatchJson);
      const status = await fetch(`http://tournament:5500/Tournament/status?tournamentName=${encodeURIComponent(tournamentName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const statusJson = await status.json();
      console.log("{DEBUG} tournament status response:", statusJson);
      if (finalMatchJson.finalists.length === 2 && statusJson.status !== 'final_started') {
        console.log("{DEBUG} final match finalists:", finalMatchJson.finalists);
        console.log("{DEBUG} final match matches:", data);

        // Emit updated bracket (make sure listeners expect this exact event name)
        io.emit("Tournament:bracket", {
          tournamentName: data.tournamentName,
        });

        // OPTIONAL GUARD (recommended)
        // if (tournament.finalStarted) return;
        // tournament.finalStarted = true;

        setTimeout(async () => {
          const player1 = finalMatchJson.finalists[0];
          const player2 = finalMatchJson.finalists[1];

          // Safer gameId
          const gameId = `final_${Date.now()}_${player1.userid}_${player2.userid}`;

          const player1Sockets = onlineUsers.get(String(player1.userid));
          const player2Sockets = onlineUsers.get(String(player2.userid));

          // Player 1
          if (player1Sockets) {
            for (const sid of player1Sockets) {
              const socket = io.sockets.sockets.get(sid);
              if (socket) socket.join(gameId);

              io.to(sid).emit("matchTournament", {
                gameId,
                side: "left",
                flagTournament: true,
                tournamentName: data.tournamentName,
                final: "final",
              });
            }
          }

          // Player 2
          if (player2Sockets) {
            for (const sid of player2Sockets) {
              const socket = io.sockets.sockets.get(sid);
              if (socket) socket.join(gameId);

              io.to(sid).emit("matchTournament", {
                gameId,
                side: "right",
                flagTournament: true,
                tournamentName: data.tournamentName,
                final: "final",
              });
            }
          }
          await fetch('http://tournament:5500/Tournament/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tournamentName: tournamentName,
              status: 'final_started'
            }),
          })
          console.log(
            `{FINAL STARTED} room=${gameId}, players=${player1.userid} vs ${player2.userid}`
          );
        }, 10000);
      }

      else
        socket.emit("Tournament:bracket", { tournamentName: data.tournamentName });

    });

  })
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