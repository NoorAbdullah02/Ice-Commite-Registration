// Banglish comments sudhu
// Ei file student post update kore admin panel theke

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// PUT /api/update-post/:id - admin student post change kore (email send noy)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { apply_for_post } = req.body;

    if (!apply_for_post) {
      return res.status(400).json({ error: 'Post required' });
    }

    // Valid posts check kore
    const validPosts = [
      'President',
      'Vice President',
      'General Secretary',
      'Treasurer',
      'Organizing Secretary',
      'Executive Member',
      'Vice President (Technical)',
      'Assistant General Secretary',
      'Joint Secretary',
      'Assistant Joint Secretary',
      'Publicity Secretary (Outreach & Activation)',
      'Publicity Secretary (Social Media Management)',
      'Office Secretary (Resource Management)',
      'Office Secretary (Event Management)',
      'Financial Secretary',
      'IT Secretary (Webmaster)',
      'IT Secretary (Design & Creativity)',
      'Executive Member (Logistics)',
      'Executive Member (Cultural Activities)',
      'Executive Member (Social Media Management)',
      'Executive Member (Documentation)',
      'Executive Member (Event Management)',
      'Executive Member (IT & Gaming)',
      'Secretary'
    ];

    if (!validPosts.includes(apply_for_post)) {
      return res.status(400).json({ error: 'Invalid post' });
    }

    // Student find kore
    const student = await prisma.student.findUnique({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Post update kore database e (email send noy)
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { apply_for_post }
    });

    res.json({
      success: true,
      message: `Post updated to ${apply_for_post}`,
      student: updatedStudent
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

export default router;
