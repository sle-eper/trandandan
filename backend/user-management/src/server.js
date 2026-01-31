import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { initializeDatabase, getDatabase, closeDatabase } from './config/database.js'
import profileRoutes from './routes/profileRoutes.js';
import friendshipRoutes from './routes/friendshipRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true
});
fastify.register(multipart, {
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB limit
    }
});

// await fastify.register(rateLimit, {
//   max: 100,            
//   timeWindow: '1 minute' 
// })

fastify.register(fastifyCors, {
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8443', 'https://localhost:8443', 'http://localhost:443', 'https://localhost:443'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user']
});

fastify.register(fastifyStatic, {
    root: '/usr/src/app/public/avatars',
    prefix: '/uploads/',
});


fastify.get('/api', (req, reply) => {
    return {
        message: 'API is running',
        version: '1.0.0',
        endpoints: {
            users: '/api/users',
            frontend: '/'
        }
    };
});

async function start() {
    try {
        await initializeDatabase();

        const db = getDatabase();

        fastify.decorate('db', db);



        fastify.register(profileRoutes);
        fastify.register(friendshipRoutes);
        fastify.register(gameRoutes);
        



        await fastify.listen({ port: 3000, host: '0.0.0.0' });

    } catch (error) {
        fastify.log.error(error, '❌ Error starting server:');
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    await closeDatabase();
    await fastify.close();
    process.exit(0);
});

start();
