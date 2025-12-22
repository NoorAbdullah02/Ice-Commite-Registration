import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || (() => {
  console.warn('⚠️ JWT_SECRET not set in environment. Using default (NOT for production)');
  return 'dev_secret_key_change_in_production';
})();

const TOKEN_EXPIRY = '7d';

// Sign JWT token with payload
export function signToken(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid token payload');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// Verify JWT token and return payload
export function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return null;
  }
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

// Decode token without verification (for debugging)
export function decodeToken(token) {
  if (!token) return null;
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}
