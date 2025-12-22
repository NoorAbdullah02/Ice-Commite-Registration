import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn('⚠️ CLOUDINARY_CLOUD_NAME not configured');
}

// Upload buffer to Cloudinary
export async function uploadToCloudinary(buffer, fileName, mimeType) {
  return new Promise((resolve, reject) => {
    // Generate unique public ID
    const timestamp = Date.now();
    const sanitizedName = fileName
      .split('.')[0]
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 30);
    
    const publicId = `ice_committee/${timestamp}_${sanitizedName}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ice_committee',
        resource_type: 'auto',
        public_id: publicId,
        format: 'webp', // Convert to WebP for optimization
        quality: 'auto', // Auto quality
        fetch_format: 'auto', // Auto format based on browser
        flags: 'progressive', // Progressive loading
        timeout: 60000 // 60 second timeout
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          console.log('Cloudinary upload success:', result.public_id);
          resolve(result);
        }
      }
    );

    // Handle stream errors
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      reject(new Error(`Upload stream error: ${error.message}`));
    });

    // Write buffer to stream
    stream.end(buffer);
  });
}

// Delete image from Cloudinary
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

// Get image optimization URL
export function getOptimizedUrl(publicId, options = {}) {
  const defaultOptions = {
    width: 500,
    height: 500,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  };

  return cloudinary.url(publicId, {
    ...defaultOptions,
    ...options
  });
}
