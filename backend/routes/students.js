import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Cache for stats (update every 30 seconds)
let statsCache = { data: null, timestamp: 0 };
const CACHE_DURATION = 30000; // 30 seconds

function isStatsCacheValid() {
  return Date.now() - statsCache.timestamp < CACHE_DURATION;
}

// GET /api/students - Fetch all students with filtering and pagination
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Parse query parameters
    const { search = '', post = '', department = '', batch = '', page = '1', limit = '50' } = req.query;
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    // Build filter conditions
    const where = {};

    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      where.OR = [
        { full_name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { ID_no: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    if (post.trim()) {
      where.apply_for_post = { equals: post.trim(), mode: 'insensitive' };
    }

    if (department.trim()) {
      where.department = { equals: department.trim(), mode: 'insensitive' };
    }

    if (batch.trim()) {
      where.batch = { equals: batch.trim(), mode: 'insensitive' };
    }

    // Fetch students with pagination
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          id: true,
          full_name: true,
          ID_no: true,
          email: true,
          phone: true,
          department: true,
          batch: true,
          gender: true,
          apply_for_post: true,
          photo_url: true,
          selected: true,
          createdAt: true
        }
      }),
      prisma.student.count({ where })
    ]);

    // Get stats (from cache if available)
    let stats;
    if (isStatsCacheValid()) {
      stats = statsCache.data;
    } else {
      const [totalCount, selectedCount, pendingCount] = await Promise.all([
        prisma.student.count(),
        prisma.student.count({ where: { selected: true } }),
        prisma.student.count({ where: { selected: false } })
      ]);
      stats = { total: totalCount, selected: selectedCount, pending: pendingCount };
      statsCache = { data: stats, timestamp: Date.now() };
    }

    res.json({
      success: true,
      stats,
      students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      },
      count: students.length
    });
  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch students',
      code: 'FETCH_STUDENTS_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// GET /api/students/stats - Get dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Use cache if available
    if (isStatsCacheValid()) {
      return res.json({
        success: true,
        stats: statsCache.data,
        cached: true
      });
    }

    const [total, selected, pending] = await Promise.all([
      prisma.student.count(),
      prisma.student.count({ where: { selected: true } }),
      prisma.student.count({ where: { selected: false } })
    ]);

    const stats = { total, selected, pending };
    statsCache = { data: stats, timestamp: Date.now() };

    res.json({
      success: true,
      stats,
      cached: false
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      code: 'FETCH_STATS_ERROR'
    });
  }
});

// GET /api/students/export - Export students data (admin only)
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const { format = 'json', selected = 'all' } = req.query;

    const where = {};
    if (selected === 'true') {
      where.selected = true;
    } else if (selected === 'false') {
      where.selected = false;
    }

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    if (format === 'csv') {
      // Convert to CSV
      const headers = ['ID', 'Name', 'Email', 'Phone', 'ID No', 'Department', 'Batch', 'Gender', 'Applied For', 'Selected', 'Date'];
      const rows = students.map(s => [
        s.id,
        `"${s.full_name}"`,
        s.email,
        s.phone,
        s.ID_no,
        s.department,
        s.batch || 'N/A',
        s.gender,
        s.apply_for_post,
        s.selected ? 'Yes' : 'No',
        new Date(s.createdAt).toLocaleDateString()
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=students-export.csv');
      return res.send(csv);
    }

    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      error: 'Failed to export data',
      code: 'EXPORT_ERROR'
    });
  }
});

export default router;
