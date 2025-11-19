// Banglish comments sudhu
// Ei file student registration handle kore

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendRegistrationEmail } from '../utils/email.js';

const router = Router();
const prisma = new PrismaClient();

// Zod diye form validation
const RegistrationSchema = z.object({
  full_name: z.string().min(1, 'Name required'),
  ID_no: z.string().min(1, 'ID required'),
  batch: z.string().optional(),
  phone: z.string().min(1, 'Phone required'),
  email: z.string().email('Valid email required'),
  department: z.string().min(1, 'Department required'),
  gender: z.string().min(1, 'Gender required'),
  apply_for_post: z.string().min(1, 'Post required'),
  photo_url: z.string().url('Valid URL required'),
  note: z.string().optional()
});

// POST /api/register - student registration
router.post('/', async (req, res) => {
  try {
    // Validation
    const validated = RegistrationSchema.parse(req.body);

    // Check if email already exists
    const existingStudent = await prisma.student.findUnique({
      where: { email: validated.email }
    });

    if (existingStudent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Database te create kore
    const student = await prisma.student.create({
      data: {
        full_name: validated.full_name,
        ID_no: validated.ID_no,
        batch: validated.batch || null,
        phone: validated.phone,
        email: validated.email,
        department: validated.department,
        gender: validated.gender,
        apply_for_post: validated.apply_for_post,
        photo_url: validated.photo_url,
        note: validated.note || ''
      }
    });

    // Registration email pathay
    try {
      await sendRegistrationEmail(student.full_name, student.email, student);
    } catch (emailError) {
      console.log('Email send failed (non-critical):', emailError.message);
      // Registration success, email fail hole bhi response success hobe
    }

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful! Check your email.',
      student 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.flatten() });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
