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
      await sendSelectionEmail(student.full_name, student.email, student.apply_for_post, student);
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

// POST /api/select/bulk - bulk select multiple students
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ error: 'Student IDs array required' });
    }

    // Verify all students exist
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } }
    });

    if (students.length !== studentIds.length) {
      return res.status(404).json({ error: 'One or more students not found' });
    }

    // Update all students to selected
    const updatedStudents = await prisma.student.updateMany({
      where: { id: { in: studentIds } },
      data: { selected: true }
    });

    // Send confirmation emails to all students
    let emailSuccessCount = 0;
    let emailFailCount = 0;

    for (const student of students) {
      try {
        await sendSelectionEmail(student.full_name, student.email, student.apply_for_post, student);
        emailSuccessCount++;
      } catch (emailError) {
        console.log(`Email failed for ${student.email}:`, emailError.message);
        emailFailCount++;
      }
    }

    res.json({
      success: true,
      message: `Successfully confirmed ${updatedStudents.count} students`,
      confirmed: updatedStudents.count,
      emailsSent: emailSuccessCount,
      emailsFailed: emailFailCount
    });
  } catch (error) {
    console.error('Bulk select error:', error);
    res.status(500).json({ error: 'Failed to bulk select students' });
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
