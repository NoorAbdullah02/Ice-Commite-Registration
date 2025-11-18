// Banglish comments sudhu
// Ei file photo upload handle kore Cloudinary e

import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = Router();

// Memory e file store kore
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
  fileFilter: (req, file, cb) => {
    // Allow image files with various mime types
    const allowedMimes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/gif'
    ];
    
    console.log('📸 File upload attempt:', {
      name: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname
    });
    
    if (!allowedMimes.includes(file.mimetype)) {
      console.error('❌ File rejected - invalid mimetype:', file.mimetype);
      cb(new Error(`Invalid file type: ${file.mimetype}. Only JPG and PNG files allowed`));
    } else {
      console.log('✅ File accepted');
      cb(null, true);
    }
  }
});

// POST /api/upload - upload photo to cloudinary
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Cloudinary e upload kore
    const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

export default router;
