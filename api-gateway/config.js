export const config = {
  port: process.env.PORT || 4000,
  host: process.env.HOST || '0.0.0.0',
  
  // Service URLs
  services: {
    user: process.env.USER_SERVICE_URL || 'http://localhost:3000',
  },
  
  // JWT Secret Key
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  
  // CORS allowed origins
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:4000'
  ],

  // Rate limiting
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_WINDOW || '15 minutes'
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};