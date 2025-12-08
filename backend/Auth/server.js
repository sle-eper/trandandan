import Fastify from 'fastify';
import formbody from '@fastify/formbody';
import { join } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './Routes/AuthRoutes.js';
import fastifyStatic from '@fastify/static';
import dotenv from 'dotenv'
import fastifyCookie from '@fastify/cookie';
import * as authController from './controllers/authController.js';
import cors from "@fastify/cors";

dotenv.config();

const fastify = Fastify({ logger: true });
await fastify.register(cors, {
  origin: "http://localhost", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
});
await fastify.register(formbody);
await fastify.register(fastifyCookie);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fastify.register(fastifyStatic, {
  root: join(__dirname, 'public'),
});
fastify.decorate('verifyInternal', async (request, reply) => {
  const token = request.headers['x-internal-token'];
  if (token !== process.env.INTERNAL_SECRET) {
    reply.code(403).send({ error: 'Forbidden' });
  }
});
fastify.get('/auth/verify', authController.verifyUser_get);
await fastify.register(authRoutes, { prefix: '/api/auth' });
const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(fastify.printRoutes());
    console.log('Server listening on port 5000');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};
start();