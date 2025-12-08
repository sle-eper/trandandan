import Fastify from 'fastify';
import formbody from '@fastify/formbody';
import cors from "@fastify/cors";
import TourRoutes from './src/tournament/tournament.controller.js'
import participantRoutes from './src/participant/participant.controller.js'
import { initializeDatabase, getDatabase, closeDatabase } from './config/database.js'
const fastify = Fastify({ logger: true });
await fastify.register(cors, {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
});
await fastify.register(formbody);
await initializeDatabase();
await fastify.register(TourRoutes, { prefix: '/tournament/' });
await fastify.register(participantRoutes, { prefix: '/participant/' });
const start = async () => {
  try {
    const PORT =  5500;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(fastify.printRoutes());
    console.log('Server listening on port 5500');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start();