// Banglish comments sudhu
// Ei file admin login handle kore aar JWT token set kore

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';

const router = Router();
const prisma = new PrismaClient();

// Hardcoded default admins (fallback)
const defaultAdmins = [
  { username: 'ice_dep', password: 'ice_dep12' },
  { username: 'noor', password: 'noorabdullah' }
];

// POST /api/admin/login - admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Prothome database e check kore
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (admin) {
      // Password compare kore
      const passwordMatch = await bcrypt.compare(password, admin.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Token sign kore
      const token = signToken({ id: admin.id, username: admin.username });
      
      // HttpOnly cookie set kore
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({ success: true, message: 'Login successful' });
    }

    // Fallback to hardcoded admins (database te na thakle)
    const hardcodedAdmin = defaultAdmins.find(
      (a) => a.username === username && a.password === password
    );

    if (hardcodedAdmin) {
      const token = signToken({ username });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      return res.json({ success: true, message: 'Login successful' });
    }

    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
