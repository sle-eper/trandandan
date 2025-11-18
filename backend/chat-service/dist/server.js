"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./db/database");
const fetchingData_1 = require("./fetchingData");
const fastify_1 = __importDefault(require("fastify"));
const fastify_socket_io_1 = __importDefault(require("fastify-socket.io"));
const server = (0, fastify_1.default)();
server.register(fastify_socket_io_1.default, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
//TODO convert all ids to string
const onlineUsers = new Map(); //TODO handel multiple tab
const statusOfTowFriend = new Map(); //TODO cash on time
server.ready().then(() => {
    const io = server.io;
    io.use((socket, next) => {
        // Get user ID from handshake headers (set by nginx)
        const userId = socket.handshake.headers['x-user-id'];
        const user = socket.handshake.headers['x-user'];
        console.log('User ID from headers:', userId);
        console.log('User Data from headers:', user);
        if (!userId) {
            return next(new Error('Authentication error'));
        }
        // Attach user data to socket
        socket.data.userId = userId;
        socket.data.user = user;
        next();
    });
    io.on("connection", async (socket) => {
        //get data of user on connection 
        socket.on("con", async (id) => {
            try {
                const id = socket.data.userId;
                const datOfUser = await (0, fetchingData_1.fetchUserData)(id); // get data of user from user-management service
                onlineUsers.set(id, socket.id);
                // socket.emit('setIMg',datOfUser.img)
                // console.log(Array.from(onlineUsers.entries()));
                // console.log('----------------------');
            }
            catch (err) {
                console.error('Error :', err);
            }
        });
        socket.on("send_message", async (data) => {
            try {
                const myId = data.myId; //
                const friendId = data.friendId; //
                console.log(friendId);
                const msg = data.value; //
                const roomName = [myId, friendId].sort().join("_");
                if (!statusOfTowFriend.has(roomName)) {
                    const status = await (0, database_1.getStatusOfTowFriends)(myId, friendId);
                    statusOfTowFriend.set(roomName, status);
                }
                const status = statusOfTowFriend.get(roomName);
                if (status) {
                    const status1 = status.status1.status; //
                    const status2 = status.status2.status; //
                    if (status1 &&
                        status2 &&
                        status1 === "accepted" &&
                        status2 === "accepted") {
                        const friendSocketId = onlineUsers.get(String(friendId));
                        const msgId = await (0, database_1.saveMsg)(myId, friendId, msg, roomName, "waiting");
                        const timeOfMsg = (0, database_1.getTimeOfMsg)(msgId);
                        const UserData = (0, database_1.dataOfUser)(friendId);
                        socket.to(roomName).emit("receive_message", msg, msgId, myId, timeOfMsg, UserData);
                        socket.to(friendSocketId).emit("live", myId, roomName, msg, timeOfMsg, UserData);
                        // io.to(friendSocketId).emit("live", myId, roomName, msg);
                    }
                }
            }
            catch (err) {
                console.error('Error :', err);
            }
        });
        socket.on('ack_message', async (msgId) => {
            await (0, database_1.changeToRecv)(msgId); // update status to 'sent'
        });
        socket.on("joinToRoom", (roomName) => {
            try {
                const rooms = socket.rooms;
                for (const room of rooms) {
                    if (room != socket.id)
                        socket.leave(room);
                }
                socket.join(roomName);
            }
            catch (err) {
                console.error('Error in sendMsg:', err);
            }
        });
        socket.on("get_friends", async (id) => {
            try {
                const friends = await (0, database_1.getFriendsOfUser)(id);
                const waitingMsg = await (0, database_1.getWaitingMsg)(id);
                socket.emit("friends_list", { friends, waitingMsg });
            }
            catch (err) {
                console.error('Error in sendMsg:', err);
            }
        });
        socket.on("status", async (data) => {
            try {
                const roomName = [data.user_id, data.friend_id].sort().join("_");
                const newStatus = await (0, database_1.changeStatusOfFriends)(data);
                if (statusOfTowFriend.has(roomName)) {
                    statusOfTowFriend.set(roomName, newStatus);
                }
                else
                    (!statusOfTowFriend.has(roomName));
                {
                    const status = await (0, database_1.getStatusOfTowFriends)(data.user_id, data.friend_id);
                    statusOfTowFriend.set(roomName, status);
                }
                const status = statusOfTowFriend.get(roomName);
                if (status) {
                    const status1 = status?.status1?.status;
                    const status2 = status?.status2?.status;
                    let statusGlobal = "blocked";
                    if (status1 &&
                        status2 &&
                        status1 === "accepted" &&
                        status2 === "accepted")
                        statusGlobal = "accepted";
                    // io.emit("blockOrAccepted", roomName, statusGlobal);
                    const userSocket = onlineUsers.get(data.user_id);
                    const friendSocket = onlineUsers.get(data.friend_id);
                    if (userSocket)
                        io.to(userSocket).emit("blockOrAccepted", roomName, statusGlobal);
                    if (friendSocket)
                        io.to(friendSocket).emit("blockOrAccepted", roomName, statusGlobal);
                }
            }
            catch (err) {
                console.error('Error in sendMsg:', err);
            }
        });
        socket.on("get_status", async (data) => {
            try {
                const roomName = [data.myId, data.friendId].sort().join("_");
                if (!statusOfTowFriend.has(roomName)) {
                    const status = await (0, database_1.getStatusOfTowFriends)(data.myId, data.friendId);
                    statusOfTowFriend.set(roomName, status);
                }
                const status = statusOfTowFriend.get(roomName);
                if (status) {
                    const status1 = status.status1?.status;
                    const status2 = status.status2?.status;
                    let allow = false;
                    if (status1 == undefined || status2 == undefined)
                        allow = true;
                    if (status1 &&
                        status2 &&
                        status1 === "accepted" &&
                        status2 === "accepted")
                        allow = true;
                    socket.emit("allowMsg", allow);
                }
            }
            catch (err) {
                console.error('Error in sendMsg:', err);
            }
        });
        socket.on('get_messages', async (data) => {
            const roomName = [data.myId, data.friendId].sort().join('_');
            const limit = data.limit || 20;
            const offset = data.offset || 0;
            await (0, database_1.changeAllToRecv)(data.myId, roomName);
            const messages = await (0, database_1.getAllMsg)(roomName, limit, offset);
            const UserData = (0, database_1.dataOfUser)(data.friendId);
            // console.log('---------get all--------');
            // console.table(messages);
            // console.log('------------------------');
            socket.emit('messages_batch', messages.reverse(), UserData.img);
        });
        socket.on('get_old_messages', async (data) => {
            const roomName = [data.myId, data.friendId].sort().join('_');
            const limit = data.limit || 20;
            const offset = data.offset || 0;
            await (0, database_1.changeAllToRecv)(data.myId, roomName);
            const messages = await (0, database_1.getAllMsg)(roomName, limit, offset);
            const UserData = (0, database_1.dataOfUser)(data.friendId);
            // console.table(messages);
            // console.log('---------get old--------');
            // console.table(data);
            // console.log('------------------------');
            socket.emit('messages_old_batch', messages, UserData.img);
        });
        socket.on("disconnect", () => {
            try {
                const userId = socket.data.userId;
                if (userId && onlineUsers.get(userId) === socket.id)
                    onlineUsers.delete(userId);
            }
            catch (err) {
                console.error('Error in sendMsg:', err);
            }
        });
    });
});
async function startServer() {
    await server.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Server running on 0.0.0.0:3000");
}
startServer();
