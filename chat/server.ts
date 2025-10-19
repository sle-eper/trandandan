// import Fastify from "fastify";
// import path from "path";
// import { fileURLToPath } from "url";
// import fastifyStatic from "@fastify/static";
// import fastifySocketIO from "fastify-socket.io";



// import type { Server } from "socket.io";
// import type { FastifyInstance } from "fastify";

// declare module "fastify" {
//   interface FastifyInstance {
//     io: Server;
//   }
// }

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = Fastify(/* {logger:true} */);

// await app.register(fastifySocketIO, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });


// await app.register(fastifyStatic, {
//   root: path.join(__dirname, "src"),
//   prefix: "/",
// });

// app.get("/", async (req, reply) => {
//   return reply.sendFile("index.html");
// });


// app.ready().then(()=>{
//     const io = app.io;
//     function sendUserList(logout?: string | undefined)
//     {
//         const room = io.sockets.adapter.rooms.get('global'); 
//         const client = [];
//         if(room)
//         {
//             for(const id of room)
//             {
//                 const user = io.sockets.sockets.get(id);
//                 if(user)
//                 {
//                     client.push({id , userName : user.data.username})
//                 }
//             }
//         }
//         io.to('global').emit('online',client);
//         if (logout) io.to('global').emit('system message', logout);
//     };

//     io.on('connect',(socket)=>{
//         console.log(`connection id from server  ${socket.id}`);
//         socket.on('chat message',(msg)=>{
//             const userName = socket.data.username || 'Guest';
//             const data = {
//                 userName,
//                 msg,
//                 id : socket.id,
//                 time: Date.now()
//             };
//             io.to('global').emit('chat message',data);
//             console.log(`${socket.id} send ${msg}`);
//         });
//         socket.on('join',(username)=>{
//             socket.data.username = username;
//             socket.join('global');
//             sendUserList();
//         })
//         socket.on('disconnect',() =>{
//             const userName = socket.data?.username || 'Guest';
//             sendUserList(`${userName} disconnect`);
//         })
//     })
// })

// const PORT = 3000;
// await app.listen({ port: PORT , host : '0.0.0.0' });
// app.log.info(`Server listening on http://localhost:${PORT , '0.0.0.0'}`);


import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";

import fastify from "fastify";
import fastifyIO from "fastify-socket.io";

const server = fastify();
server.register(fastifyIO,{
    cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// server.get("/", (req, reply) => {
//   server.io.emit("hello");
// });

server.ready().then(() => {
  const io = server.io;
  // we need to wait for the server to be ready, else `server.io` is undefined
  io.on("connection", (socket) => {
    socket.on('sedMsg',(msg)=>{
      socket.broadcast.emit('msg',msg)
      // io.emit.prod('Msg',msg)
    })

    console.log(`slam akhina ${socket.id}`);
  });
});


await server.listen({port:3000});
console.log(`server run in port 3000`);
