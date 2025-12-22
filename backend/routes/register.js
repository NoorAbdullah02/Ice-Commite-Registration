import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendRegistrationEmail } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

// Validation schema with improved constraints
const RegistrationSchema = z.object({
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  ID_no: z.string()
    .min(2, 'ID is required')
    .max(50, 'ID must not exceed 50 characters'),
  batch: z.string()
    .optional()
    .nullable(),
  phone: z.string()
    .regex(/^\+?[0-9\s-()]+$/, 'Invalid phone number format')
    .min(10, 'Phone must be at least 10 characters'),
  email: z.string()
    .email('Valid email required')
    .max(100, 'Email must not exceed 100 characters'),
  department: z.string()
    .min(2, 'Department required')
    .max(100, 'Department must not exceed 100 characters'),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say', 'Not specified'], { 
    errorMap: () => ({ message: 'Invalid gender selection' })
  }),
  apply_for_post: z.string()
    .min(2, 'Post required')
    .max(100, 'Post must not exceed 100 characters'),
  photo_url: z.string()
    .url('Valid photo URL required')
    .max(500, 'Photo URL must not exceed 500 characters'),
  note: z.string()
    .optional()
    .nullable()
    .default('')
    .refine(val => !val || val.length <= 500, 'Note must not exceed 500 characters')
});

// POST /api/register - Student registration endpoint
router.post('/register', async (req, res) => {
  let prismaTransaction = null;

  try {
    // Validate input with Zod
    let validated;
    try {
      validated = RegistrationSchema.parse(req.body);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return res.status(400).json({ 
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationError.flatten().fieldErrors
        });
      }
      throw validationError;
    }

    // Sanitize data
    validated = {
      ...validated,
      full_name: validated.full_name.trim(),
      email: validated.email.toLowerCase().trim(),
      phone: validated.phone.trim(),
      ID_no: validated.ID_no.trim(),
      department: validated.department.trim(),
      apply_for_post: validated.apply_for_post.trim(),
      batch: validated.batch?.trim() || null,
      note: (validated.note || '').trim() || ''
    };

    // Check for existing registration
    const existingStudent = await prisma.student.findUnique({
      where: { email: validated.email }
    });

    if (existingStudent) {
      return res.status(409).json({ 
        error: 'Email already registered',
        code: 'EMAIL_EXISTS',
        message: 'A student with this email address has already registered.'
      });
    }

    // Create student record
    const student = await prisma.student.create({
      data: {
        full_name: validated.full_name,
        ID_no: validated.ID_no,
        batch: validated.batch,
        phone: validated.phone,
        email: validated.email,
        department: validated.department,
        gender: validated.gender,
        apply_for_post: validated.apply_for_post,
        photo_url: validated.photo_url,
        note: validated.note,
        selected: false
      }
    });

    // Send confirmation email (non-critical - don't fail if email fails)
    try {
      await sendRegistrationEmail(student.full_name, student.email, student);
      console.log('✅ Registration confirmation email sent to:', student.email);
    } catch (emailError) {
      console.warn('⚠️ Email send failed (non-critical):', emailError.message);
      // Continue despite email failure
    }

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Check your email for confirmation.',
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        apply_for_post: student.apply_for_post
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);

    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: 'This email is already registered',
        code: 'DUPLICATE_EMAIL'
      });
    }

    // Log full error for debugging
    console.error('❌ Full error:', JSON.stringify(error, null, 2));

    res.status(500).json({ 
      error: error.message || 'Registration failed',
      code: 'REGISTRATION_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message, stack: error.stack })
    });
  }
});

// GET /api/register/check-email/:email - Check if email is already registered
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    const student = await prisma.student.findUnique({
      where: { email: email.toLowerCase() }
    });

    res.json({ 
      success: true,
      exists: !!student,
      email: email.toLowerCase()
    });
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({ 
      error: 'Failed to check email',
      code: 'CHECK_EMAIL_ERROR'
    });
  }
});

export default router;
