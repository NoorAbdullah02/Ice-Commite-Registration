// Banglish comments sudhu
// Ei file students list fetch kore with search/filter

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/students - fetch all students (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Query params theke filters extract kore
    const { search, post, department, batch } = req.query;

    // Where clause build kore
    const where = {};
    
    if (search) {
      where.OR = [
        { full_name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { ID_no: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (post) {
      where.apply_for_post = post;
    }

    if (department) {
      where.department = department;
    }

    if (batch) {
      where.batch = batch;
    }

    // Students fetch kore
    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Stats calculate kore
    const total = await prisma.student.count();
    const selected = await prisma.student.count({ where: { selected: true } });
    const pending = await prisma.student.count({ where: { selected: false } });

    res.json({
      success: true,
      stats: { total, selected, pending },
      students,
      count: students.length
    });
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// GET /api/students/stats - dashboard stats only
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const total = await prisma.student.count();
    const selected = await prisma.student.count({ where: { selected: true } });
    const pending = await prisma.student.count({ where: { selected: false } });

    res.json({
      success: true,
      stats: { total, selected, pending }
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
