// Banglish comments sudhu
// Ei file JWT cookie verify kore aar admin auth check kore

import { verifyToken } from '../utils/jwt.js';

export function authMiddleware(req, res, next) {
  // Cookie theke token extract kore
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - no token' });
  }

  // Token verify kore
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized - invalid token' });
  }

  // User info req e attach kore
  req.user = user;
  next();
}
