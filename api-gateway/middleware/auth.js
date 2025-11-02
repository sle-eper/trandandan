// Authentication middleware for API Gateway
export async function authenticateToken(request, reply) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.code(401).send({
        success: false,
        error: 'No authorization token provided'
      });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({
        success: false,
        error: 'Invalid authorization format. Use: Bearer <token>'
      });
    }
    
    // Verify JWT token using Fastify's JWT plugin
    await request.jwtVerify();
    
    // Token is valid, user info now in request.user
    request.log.info(`✅ Authenticated user: ${request.user.username} (ID: ${request.user.userId})`);
    
  } catch (error) {
    request.log.error('❌ Authentication failed:', error.message);
    
    if (error.message.includes('expired')) {
      return reply.code(401).send({
        success: false,
        error: 'Token has expired. Please login again.'
      });
    }
    
    return reply.code(401).send({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

// Check if endpoint is public (doesn't require authentication)
export function isPublicEndpoint(url) {
  const publicEndpoints = [
    '/auth/signup',
    '/auth/login', 
    '/health',
    '/'
  ];
  
  return publicEndpoints.some(endpoint => url.includes(endpoint));
}