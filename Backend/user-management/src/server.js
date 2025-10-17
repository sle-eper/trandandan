// import Fastify from 'fastify'
// import { initializeDatabase, getDatabase, closeDatabase } from './config/database.js';
// import userRoutes from './routes/user.routes.js';
// const fastify = Fastify({
//     logger: true
// });


// fastify.get('/',(req, reply) => {
//     return{
//         message: 'Hello World'
//     }
// });


// async function start() {
//     try {
        
//         console.log('🔄 Initializing database...');
//         await initializeDatabase();
        
//         console.log('🔄 Getting database instance...');
//         const db = getDatabase();
        
//         // 3. Attach database to fastify (YOU'RE MISSING THIS!)
//         console.log('🔄 Attaching database to Fastify...');
//         fastify.decorate('db', db);
//         console.log('✅ Database attached, fastify.db exists:', !!fastify.db);
        

//         fastify.register(userRoutes, { 
//             prefix: '/api/users' 
//         });
       
        
//         console.log('🔄 Starting server...');
//         await fastify.listen({ port: 3000 });

        
//     } catch (error) {
//         fastify.log.error( error,'❌ Error starting server:');
//         process.exit(1);
//     }
// }



// start();




import Fastify from 'fastify';
import path from 'path';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { initializeDatabase, getDatabase, closeDatabase } from './config/database.js';
import userRoutes from './routes/user.routes.js';
import profileRoutes from './routes/profileRoutes.js';
import multipart from '@fastify/multipart';
// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
    logger: true
});
fastify.register(multipart);

// =====================================================
// 2. REGISTER PLUGINS FIRST (BEFORE ROUTES)
// =====================================================

// Enable CORS for frontend-backend communication
fastify.register(fastifyCors, {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
});

// Serve static files (HTML, CSS, JS)
fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/' // Serve files at root URL
});

// =====================================================
// 3. ROOT ROUTE (API endpoint, not HTML)
// =====================================================

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

// =====================================================
// 4. START SERVER WITH DATABASE
// =====================================================

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
        fastify.register(userRoutes, { 
            prefix: '/api/users' 
        });
        fastify.register(profileRoutes, { 
            prefix: '/' 
        });
       
        console.log('🔄 Starting server...');
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        
        console.log('✅ Server started successfully!');
        console.log('📱 Frontend: http://localhost:3000/');
        console.log('🔌 API: http://localhost:3000/api');
        console.log('👥 Users API: http://localhost:3000/api/users');
        
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
