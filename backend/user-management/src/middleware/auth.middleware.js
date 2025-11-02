import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || ' ';

// Authentication middleware
export async function authenticate(request, reply) {
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
    
    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request object
    request.user = {
      userId: decoded.userId || decoded.id,
      username: decoded.username,
      email: decoded.email
    };
    
    console.log(`✅ Authenticated user: ${request.user.username} (ID: ${request.user.userId})`);
    
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return reply.code(401).send({
        success: false,
        error: 'Token has expired. Please login again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return reply.code(401).send({
        success: false,
        error: 'Invalid token format'
      });
    }
    
    return reply.code(401).send({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

// Helper function to generate JWT tokens (for login)
export function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '24h' // Token expires in 24 hours
    }
  );
}