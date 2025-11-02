import Fastify from 'fastify';
import fastifyHttpProxy from '@fastify/http-proxy';
import fastifyCors from '@fastify/cors';
import fastifyJWT from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';

import { config } from './config.js';
import { authenticateToken, isPublicEndpoint } from './middleware/auth.js';

const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty'
      }
    },
    trustProxy: true
});

// Register plugins
await fastify.register(fastifyCors, {
  origin: config.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});

await fastify.register(fastifyRateLimit, {
  max: config.rateLimit.max,
  timeWindow: config.rateLimit.timeWindow,
  cache: 10000,
  skipOnError: false
});

await fastify.register(fastifyJWT, {
  secret: config.jwtSecret
});

// Health check helper
async function checkServiceHealth(serviceName, url) {
  try {
    const response = await fetch(`${url}/api`, { 
      signal: AbortSignal.timeout(5000) 
    });
    return {
      service: serviceName,
      status: response.ok ? 'healthy' : 'unhealthy',
      url: url
    };
  } catch (error) {
    return {
      service: serviceName,
      status: 'unhealthy',
      url: url,
      error: error.message
    };
  }
}

// Gateway routes
fastify.get('/', async () => ({
  name: 'API Gateway',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  endpoints: {
    health: 'GET /health',
    signup: 'POST /auth/signup',
    login: 'POST /auth/login',
    verify: 'POST /auth/verify',
    users: '/api/users/* (protected)',
  },
  documentation: 'Visit /health for service status'
}));

fastify.get('/health', async (request, reply) => {
  const serviceChecks = await Promise.all([
    checkServiceHealth('user-service', config.services.user)
  ]);
  
  const allHealthy = serviceChecks.every(check => check.status === 'healthy');

  return {
    gateway: 'healthy',
    timestamp: new Date().toISOString(),
    services: serviceChecks,
    overallStatus: allHealthy ? 'all services healthy' : 'some services down'
  };
});

// Register public routes proxy (no authentication required)
await fastify.register(async function (publicInstance) {
  // Proxy signup to user-management service
  publicInstance.register(fastifyHttpProxy, {
    upstream: config.services.user,
    prefix: '/auth/signup',
    rewritePrefix: '/profile/create',
    http2: false,
    replyOptions: {
      rewriteRequestHeaders: (request, headers) => ({
        ...headers,
        'x-forwarded-by': 'api-gateway'
      })
    }
  });

  // Proxy login to user-management service
  publicInstance.register(fastifyHttpProxy, {
    upstream: config.services.user,
    prefix: '/auth/login',
    rewritePrefix: '/auth/login',
    http2: false,
    replyOptions: {
      rewriteRequestHeaders: (request, headers) => ({
        ...headers,
        'x-forwarded-by': 'api-gateway'
      })
    }
  });
});

// Register auth verify route with proxy (requires authentication)
await fastify.register(async function (authInstance) {
  // Add authentication for this specific route
  authInstance.addHook('preHandler', authenticateToken);
  
  // Proxy verify token to user-management service
  authInstance.register(fastifyHttpProxy, {
    upstream: config.services.user,
    prefix: '/auth/verify',
    rewritePrefix: '/auth/verify',
    http2: false,
    replyOptions: {
      rewriteRequestHeaders: (request, headers) => ({
        ...headers,
        'x-user-id': request.user?.userId || '',
        'x-username': request.user?.username || '',
        'x-forwarded-by': 'api-gateway'
      })
    }
  });
});

// Protected proxy routes
await fastify.register(async function (instance) {
  // Add authentication check for all routes in this context
  instance.addHook('preHandler', async (request, reply) => {
    if (!isPublicEndpoint(request.url)) {
      await authenticateToken(request, reply);
    }
  });

  // Proxy to user service with authentication
  instance.register(fastifyHttpProxy, {
    upstream: config.services.user,
    prefix: '/api/users',
    rewritePrefix: '/',
    http2: false,
    replyOptions: {
      rewriteRequestHeaders: (request, headers) => ({
        ...headers,
        'x-user-id': request.user?.userId || '',
        'x-username': request.user?.username || '',
        'x-forwarded-by': 'api-gateway'
      })
    }
  });
});

// Error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error({
    error: error.message,
    stack: error.stack,
    url: request.url,
    method: request.method
  });
  
  // Rate limit error
  if (error.statusCode === 429) {
    return reply.code(429).send({
      success: false,
      error: 'Too many requests. Please try again later.',
      retryAfter: error.headers?.['retry-after']
    });
  }
  
  // JWT errors
  if (error.statusCode === 401) {
    return reply.code(401).send({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
  
  // Service unavailable
  if (error.code === 'ECONNREFUSED') {
    return reply.code(503).send({
      success: false,
      error: 'Service temporarily unavailable',
      message: 'Please try again later'
    });
  }
  
  // Generic error
  return reply.code(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: config.port, 
      host: config.host 
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('🚀 API GATEWAY STARTED');
    console.log('='.repeat(60));
    console.log(`📍 Gateway URL: http://${config.host}:${config.port}`);
    console.log(`📊 Health Check: http://${config.host}:${config.port}/health`);
    console.log('\n📡 Service Routes:');
    console.log(`   👤 User Service: /api/users/* → ${config.services.user}`);
    console.log('\n🔓 Public Endpoints (No Auth):');
    console.log('   POST /auth/signup');
    console.log('   POST /auth.login');
    console.log('   GET /health');
    console.log('   GET /');
    console.log('\n🔒 Protected Endpoints (Require JWT):');
    console.log('   POST /auth/verify');
    console.log('   All /api/users/* routes');
    console.log('='.repeat(60) + '\n');
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  fastify.log.info(`Received ${signal}, shutting down gracefully...`);
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

start();
