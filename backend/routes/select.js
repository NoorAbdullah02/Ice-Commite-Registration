import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { sendSelectionEmail } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

// POST /api/select - Select a single student for committee
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;

    // Validate input
    if (!studentId || typeof studentId !== 'string') {
      return res.status(400).json({ 
        error: 'Valid student ID required',
        code: 'INVALID_STUDENT_ID'
      });
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ 
        error: 'Student not found',
        code: 'STUDENT_NOT_FOUND'
      });
    }

    if (student.selected) {
      return res.status(400).json({ 
        error: 'Student is already selected',
        code: 'ALREADY_SELECTED'
      });
    }

    // Update student selection status
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { selected: true }
    });

    // Send selection notification email (non-critical)
    try {
      await sendSelectionEmail(
        student.full_name,
        student.email,
        student.apply_for_post,
        student
      );
      console.log('✅ Selection email sent to:', student.email);
    } catch (emailError) {
      console.warn('⚠️ Selection email failed (non-critical):', emailError.message);
    }

    res.json({
      success: true,
      message: 'Student selected successfully',
      student: {
        id: updatedStudent.id,
        full_name: updatedStudent.full_name,
        email: updatedStudent.email,
        apply_for_post: updatedStudent.apply_for_post,
        selected: updatedStudent.selected
      }
    });
  } catch (error) {
    console.error('Select student error:', error);
    res.status(500).json({ 
      error: 'Failed to select student',
      code: 'SELECT_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// POST /api/select/bulk - Bulk select multiple students
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { studentIds } = req.body;

    // Validate input
    if (!Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ 
        error: 'Array of student IDs required',
        code: 'INVALID_STUDENT_IDS'
      });
    }

    if (studentIds.length > 1000) {
      return res.status(400).json({ 
        error: 'Cannot select more than 1000 students at once',
        code: 'TOO_MANY_STUDENTS'
      });
    }

    // Verify all students exist
    const students = await prisma.student.findMany({
      where: { id: { in: studentIds } }
    });

    if (students.length === 0) {
      return res.status(404).json({ 
        error: 'No students found',
        code: 'NO_STUDENTS_FOUND'
      });
    }

    if (students.length !== studentIds.length) {
      const foundIds = new Set(students.map(s => s.id));
      const notFound = studentIds.filter(id => !foundIds.has(id));
      return res.status(400).json({ 
        error: 'Some students not found',
        code: 'PARTIAL_STUDENTS_FOUND',
        notFound: notFound.slice(0, 10) // Return first 10 not found
      });
    }

    // Filter already selected students
    const toSelect = students.filter(s => !s.selected);

    if (toSelect.length === 0) {
      return res.status(400).json({ 
        error: 'All students are already selected',
        code: 'ALL_SELECTED'
      });
    }

    // Update students in batch
    const updatedStudents = await prisma.student.updateMany({
      where: { id: { in: toSelect.map(s => s.id) } },
      data: { selected: true }
    });

    // Send emails to newly selected students
    let emailSuccessCount = 0;
    let emailFailCount = 0;

    for (const student of toSelect) {
      try {
        await sendSelectionEmail(
          student.full_name,
          student.email,
          student.apply_for_post,
          student
        );
        emailSuccessCount++;
      } catch (emailError) {
        console.warn(`⚠️ Email failed for ${student.email}:`, emailError.message);
        emailFailCount++;
      }
    }

    res.json({
      success: true,
      message: `${updatedStudents.count} students selected`,
      stats: {
        selected: updatedStudents.count,
        emailsSent: emailSuccessCount,
        emailsFailed: emailFailCount
      }
    });
  } catch (error) {
    console.error('Bulk select error:', error);
    res.status(500).json({ 
      error: 'Failed to bulk select students',
      code: 'BULK_SELECT_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// POST /api/select/deselect - Deselect a student
router.post('/deselect', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ 
        error: 'Student ID required',
        code: 'INVALID_STUDENT_ID'
      });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return res.status(404).json({ 
        error: 'Student not found',
        code: 'STUDENT_NOT_FOUND'
      });
    }

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: { selected: false }
    });

    res.json({
      success: true,
      message: 'Student deselected successfully',
      student: {
        id: updatedStudent.id,
        full_name: updatedStudent.full_name,
        selected: updatedStudent.selected
      }
    });
  } catch (error) {
    console.error('Deselect error:', error);
    res.status(500).json({ 
      error: 'Failed to deselect student',
      code: 'DESELECT_ERROR'
    });
  }
});

// DELETE /api/select/:id - Delete a student record
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ 
        error: 'Valid student ID required',
        code: 'INVALID_STUDENT_ID'
      });
    }

    const student = await prisma.student.findUnique({ 
      where: { id } 
    });

    if (!student) {
      return res.status(404).json({ 
        error: 'Student not found',
        code: 'STUDENT_NOT_FOUND'
      });
    }

    await prisma.student.delete({ where: { id } });

    res.json({
      success: true,
      message: 'Student deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ 
      error: 'Failed to delete student',
      code: 'DELETE_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

export default router;
