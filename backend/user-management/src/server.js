import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { initializeDatabase, getDatabase, closeDatabase } from './config/database.js'
import profileRoutes from './routes/profileRoutes.js'; 
import friendshipRoutes from './routes/friendshipRoutes.js';
import multipart from '@fastify/multipart';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true
});
fastify.register(multipart);

// Enable CORS for frontend-backend communication
fastify.register(fastifyCors, {
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
});

// Serve static files (HTML, CSS, JS)
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/' // Serve files at root URL
});

// This returns JSON for API testing
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
        console.log('🔄 Initializing database...');
        await initializeDatabase();
        
        console.log('🔄 Getting database instance...');
        const db = getDatabase();
        
        console.log('🔄 Attaching database to Fastify...');
        fastify.decorate('db', db);
        console.log('✅ Database attached, fastify.db exists:', !!fastify.db);
        
        // Register API routes
      
        fastify.register(profileRoutes, { 
             prefix: '/'
        });
        fastify.register(friendshipRoutes, { 
            prefix: '/' 
        });
       
        console.log('🔄 Starting server...');
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        
        console.log('✅ Server listening on port 3000');
    } catch (error) {
        fastify.log.error(error, '❌ Error starting server:');
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🔄 Shutting down gracefully...');
    await closeDatabase();
    await fastify.close();
    process.exit(0);
});

start();
