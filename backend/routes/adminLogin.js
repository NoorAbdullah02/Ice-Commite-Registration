import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';

const router = Router();
const prisma = new PrismaClient();

// Default admin users (fallback - should be migrated to database)
const DEFAULT_ADMINS = [
  { username: 'ice_dep', password: 'ice_dep12' },
  { username: 'noor', password: 'noorabdullah' }
];

// Rate limiting map to prevent brute force attacks
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const ATTEMPT_RESET_TIME = 15 * 60 * 1000; // 15 minutes

function isRateLimited(identifier) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (!record) {
    loginAttempts.set(identifier, { attempts: 1, firstAttempt: now });
    return false;
  }

  if (now - record.firstAttempt > ATTEMPT_RESET_TIME) {
    loginAttempts.set(identifier, { attempts: 1, firstAttempt: now });
    return false;
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return true;
  }

  record.attempts++;
  return false;
}

// POST /api/admin/login - Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Sanitize input
    const sanitizedUsername = String(username).trim().substring(0, 50);
    if (!sanitizedUsername || sanitizedUsername.length < 2) {
      return res.status(400).json({ 
        error: 'Invalid username format',
        code: 'INVALID_USERNAME'
      });
    }

    // Check rate limiting
    if (isRateLimited(sanitizedUsername)) {
      return res.status(429).json({ 
        error: 'Too many login attempts. Try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: ATTEMPT_RESET_TIME / 1000
      });
    }

    let admin = null;

    // Try database first
    try {
      admin = await prisma.admin.findUnique({
        where: { username: sanitizedUsername }
      });

      if (admin) {
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
          return res.status(401).json({ 
            error: 'Invalid credentials',
            code: 'INVALID_PASSWORD'
          });
        }
      }
    } catch (dbError) {
      console.warn('Database query failed, falling back to default admins:', dbError.message);
    }

    // Fallback to default admins if not found in database
    if (!admin) {
      const defaultAdmin = DEFAULT_ADMINS.find(a => a.username === sanitizedUsername);
      
      if (defaultAdmin && defaultAdmin.password === password) {
        admin = { id: 'default_' + sanitizedUsername, username: sanitizedUsername };
      } else {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }
    }

    // Generate JWT token
    const token = signToken({ 
      id: admin.id, 
      username: admin.username,
      role: 'admin'
    });

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Clear rate limit on successful login
    loginAttempts.delete(sanitizedUsername);

    res.json({ 
      success: true, 
      message: 'Login successful',
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      code: 'LOGIN_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// POST /api/admin/logout - Admin logout endpoint
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ 
      success: true, 
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

export default router;
