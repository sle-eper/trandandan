
import { onlineUsers } from "./server";
import { server } from "./server";


// /################################################################################
//                               Tournament notification
// /################################################################################
async function tournamentCreate(request, reply) {
    const { userid, type, data } = request.body as any;
    const io = (server as any).io;
    const sockets = onlineUsers.get(userid);
    if (sockets) {
        for (const socketId of sockets) {
            io.to(socketId).emit(type, data);
        }
    }
    reply.code(200).send({ message: 'Tournament create notification sent' });
} 


export default async function (fastify) {
    fastify.post('/tournamentCreate', tournamentCreate);
}
