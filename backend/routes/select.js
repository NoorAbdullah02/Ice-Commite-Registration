// Banglish comments sudhu
// Ei file student select kore aar selection email pathay

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { sendSelectionEmail } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

// POST /api/select - select a student for committee
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID required' });
    }

    // Student find kore
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Selected flag update kore
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { selected: true }
    });

    // Selection email pathay
    try {
      await sendSelectionEmail(student.full_name, student.email, student.apply_for_post);
    } catch (emailError) {
      console.log('Email send failed (non-critical):', emailError.message);
      // Student already selected, email fail hole bhi ok
    }

    res.json({
      success: true,
      message: 'Student selected and email sent',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Select student error:', error);
    res.status(500).json({ error: 'Failed to select student' });
  }
});

// DELETE /api/select/:id - delete a student
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Delete kore
    await prisma.student.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
