import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { sendPostUpdateEmail } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

// Valid committee positions
const VALID_POSTS = [
  'President',
  'Vice President',
  'General Secretary',
  'Treasurer',
  'Organizing Secretary',
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
  'Secretary',
  'Member'
];

// PUT /api/update-post/:id - Update student's committee position
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { apply_for_post, sendEmail = true } = req.body;

    // Validate input
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ 
        error: 'Valid student ID required',
        code: 'INVALID_STUDENT_ID'
      });
    }

    if (!apply_for_post || typeof apply_for_post !== 'string') {
      return res.status(400).json({ 
        error: 'Valid position required',
        code: 'INVALID_POST'
      });
    }

    const newPost = apply_for_post.trim();

    // Validate post is in the valid list
    if (!VALID_POSTS.includes(newPost)) {
      return res.status(400).json({ 
        error: 'Invalid committee position',
        code: 'INVALID_POSITION',
        validPositions: VALID_POSTS
      });
    }

    // Find student
    const student = await prisma.student.findUnique({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({ 
        error: 'Student not found',
        code: 'STUDENT_NOT_FOUND'
      });
    }

    const oldPost = student.apply_for_post;

    // Check if position is actually changing
    if (oldPost === newPost) {
      return res.status(400).json({ 
        error: 'New position is same as current position',
        code: 'SAME_POSITION'
      });
    }

    // Update position
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: { apply_for_post: newPost }
    });

    // Send notification email (non-critical)
    if (sendEmail === true || sendEmail === 'true') {
      try {
        await sendPostUpdateEmail(
          student.full_name,
          student.email,
          oldPost,
          newPost,
          student
        );
        console.log('✅ Position update email sent to:', student.email);
      } catch (emailError) {
        console.warn('⚠️ Position update email failed (non-critical):', emailError.message);
      }
    }

    res.json({
      success: true,
      message: `Position updated from ${oldPost} to ${newPost}`,
      student: {
        id: updatedStudent.id,
        full_name: updatedStudent.full_name,
        email: updatedStudent.email,
        apply_for_post: updatedStudent.apply_for_post,
        previousPost: oldPost
      }
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ 
      error: 'Failed to update position',
      code: 'UPDATE_POST_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// GET /api/update-post/valid-posts - Get list of valid positions
router.get('/valid-posts', authMiddleware, (req, res) => {
  res.json({
    success: true,
    validPosts: VALID_POSTS,
    count: VALID_POSTS.length
  });
});

// PUT /api/update-post/bulk - Bulk update positions
router.put('/bulk', authMiddleware, async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ 
        error: 'Updates array required',
        code: 'INVALID_UPDATES'
      });
    }

    if (updates.length > 100) {
      return res.status(400).json({ 
        error: 'Cannot update more than 100 students at once',
        code: 'TOO_MANY_UPDATES'
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const update of updates) {
      try {
        const { studentId, newPost } = update;

        if (!VALID_POSTS.includes(newPost)) {
          errorCount++;
          results.push({
            studentId,
            success: false,
            error: 'Invalid position'
          });
          continue;
        }

        const student = await prisma.student.findUnique({
          where: { id: studentId }
        });

        if (!student) {
          errorCount++;
          results.push({
            studentId,
            success: false,
            error: 'Student not found'
          });
          continue;
        }

        const updatedStudent = await prisma.student.update({
          where: { id: studentId },
          data: { apply_for_post: newPost }
        });

        successCount++;
        results.push({
          studentId,
          success: true,
          newPost: updatedStudent.apply_for_post
        });
      } catch (error) {
        errorCount++;
        results.push({
          studentId: update.studentId,
          success: false,
          error: error.message
        });
      }
    }

    res.json({
      success: successCount > 0,
      message: `${successCount} updated, ${errorCount} failed`,
      stats: {
        success: successCount,
        failed: errorCount,
        total: updates.length
      },
      results
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ 
      error: 'Bulk update failed',
      code: 'BULK_UPDATE_ERROR'
    });
  }
});

export default router;
