import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = Router();

// Multer configuration with memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();

    console.log('📸 File upload attempt:', {
      name: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      fieldname: file.fieldname
    });

    // Validate MIME type
    if (!allowedMimes.includes(file.mimetype)) {
      console.error('❌ File rejected - invalid mimetype:', file.mimetype);
      return cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, GIF`));
    }

    // Validate file extension
    if (!allowedExtensions.includes(fileExtension)) {
      console.error('❌ File rejected - invalid extension:', fileExtension);
      return cb(new Error(`Invalid file extension: ${fileExtension}`));
    }

    console.log('✅ File accepted');
    cb(null, true);
  }
});

// POST /api/upload - Upload photo to Cloudinary
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({ 
        error: 'No file uploaded',
        code: 'NO_FILE'
      });
    }

    if (req.file.size === 0) {
      console.log('❌ Empty file provided');
      return res.status(400).json({ 
        error: 'File is empty',
        code: 'EMPTY_FILE'
      });
    }

    console.log('🚀 Uploading to Cloudinary:', req.file.originalname);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    if (!result || !result.secure_url) {
      console.error('❌ Cloudinary returned no secure_url:', result);
      throw new Error('Cloudinary upload failed - no URL returned');
    }

    console.log('✅ Upload successful:', result.secure_url);
    console.log('📦 Full Cloudinary response:', JSON.stringify(result, null, 2));

    const responseData = {
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
      secure_url: result.secure_url,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        format: result.format
      }
    };
    
    console.log('📤 Sending response:', JSON.stringify(responseData, null, 2));

    // Set CORS headers explicitly for this response
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    res.json(responseData);
  } catch (error) {
    console.error('❌ Upload error:', error.message);

    // Handle multer errors
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ 
          error: 'File size exceeds 5MB limit',
          code: 'FILE_TOO_LARGE',
          maxSize: '5MB'
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
          error: 'Only one file allowed',
          code: 'TOO_MANY_FILES'
        });
      }
    }

    res.status(500).json({ 
      error: error.message || 'Failed to upload image',
      code: 'UPLOAD_ERROR',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// POST /api/upload/validate - Validate image before upload (optional)
router.post('/validate', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No file provided',
        code: 'NO_FILE'
      });
    }

    res.json({
      success: true,
      valid: true,
      file: {
        name: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        sizeInMB: (req.file.size / (1024 * 1024)).toFixed(2)
      }
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'File validation failed',
      code: 'VALIDATION_ERROR'
    });
  }
});

export default router;
