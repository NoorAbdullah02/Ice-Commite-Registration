import { verifyToken } from '../utils/jwt.js';

// Middleware to verify JWT token from cookies
export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ 
        error: 'Unauthorized - no authentication token provided',
        code: 'NO_TOKEN'
      });
    }

    const user = verifyToken(token);
    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ 
        error: 'Unauthorized - invalid or expired token',
        code: 'INVALID_TOKEN'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
}

// Optional auth middleware (doesn't fail if no token)
export function optionalAuthMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (token) {
      const user = verifyToken(token);
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
}
