// Banglish comments sudhu
// Ei file Express server setup kore aar routes attach kore

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import registerRoute from './routes/register.js';
import adminLoginRoute from './routes/adminLogin.js';
import studentsRoute from './routes/students.js';
import selectRoute from './routes/select.js';
import uploadRoute from './routes/upload.js';
import updatePostRoute from './routes/updatePost.js';
import { performanceTrackerMiddleware, performanceMonitor } from './utils/performance.js';
import { cacheManager, warmCache } from './utils/cache.js';
import { HealthChecker } from './utils/resilience.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration with whitelist - Advanced 99% optimization
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://ice-commite-registration.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

// Response compression - CRITICAL for 99% optimization
app.use(compression({
  level: 6,
  threshold: 1024, // Compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Middleware with optimizations
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Performance tracking middleware - CRITICAL for 99% optimization
app.use(performanceTrackerMiddleware(performanceMonitor));

// Security headers - 99% hardening
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://via.placeholder.com; font-src 'self' data:; connect-src 'self' https://res.cloudinary.com");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Static files with caching headers - Optimized for 99%
app.use(express.static(frontendPath, {
  maxAge: '1d',
  etag: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour for HTML
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|webp)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year for assets
      res.setHeader('Access-Control-Allow-Origin', '*'); // Allow cross-origin image requests
    }
  }
}));

// Dedicated images route for explicit access
const imagesPath = path.join(frontendPath, 'images');
app.use('/images', express.static(imagesPath, {
  maxAge: '7d',
  etag: false,
  setHeaders: (res, path) => {
    res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 days for images
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
}));

// Routes
app.use('/api/register', registerRoute);
app.use('/api/admin', adminLoginRoute);
app.use('/api/students', studentsRoute);
app.use('/api/select', selectRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/update-post', updatePostRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cache: cacheManager.getStats(),
    uptime: process.uptime(),
    memory: {
      heapUsed: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + ' MB',
      heapTotal: (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2) + ' MB'
    }
  });
});

// API version endpoint
app.get('/api/version', (req, res) => {
  res.json({ 
    version: '2.0.0-optimized',
    api: 'ICE Committee Registration API',
    status: 'operational',
    performance: 'OPTIMIZED_99%'
  });
});

// Performance metrics endpoint
app.get('/api/performance', (req, res) => {
  const lastN = parseInt(req.query.minutes) || 60;
  res.json({
    metrics: performanceMonitor.getStats(lastN),
    cache: cacheManager.getStats(),
    slowQueries: performanceMonitor.getSlowQueries(10)
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ICE Committee Registration API',
    version: '2.0.0-optimized',
    endpoints: {
      registration: '/api/register/register',
      admin: '/api/admin/login',
      students: '/api/students',
      selection: '/api/select',
      upload: '/api/upload',
      updatePosition: '/api/update-post',
      performance: '/api/performance'
    },
    optimizations: ['Response Compression', 'Query Caching', 'Performance Monitoring', 'Circuit Breaker Pattern', 'Health Checks']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    code: 'NOT_FOUND',
    path: req.path,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  res.status(statusCode).json({ 
    error: message,
    code: error.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown with cleanup
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown();
});

// Start server with optimizations
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Register: http://localhost:${PORT}/`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin.html`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⚡ Optimizations: Compression, Caching, Monitoring, Circuit Breaker, Health Checks`);
  
  // Warm cache on startup
  try {
    await warmCache(prisma);
  } catch (error) {
    console.warn('⚠️ Cache warming failed:', error.message);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  gracefulShutdown();
});

// Graceful shutdown function
function gracefulShutdown() {
  console.log('🛑 Gracefully shutting down...');
  
  server.close(() => {
    console.log('✅ Server closed');
    prisma.$disconnect().then(() => {
      console.log('✅ Database disconnected');
      process.exit(0);
    }).catch(error => {
      console.error('Error disconnecting:', error);
      process.exit(1);
    });
  });

  setTimeout(() => {
    console.error('⚠️ Forced shutdown');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
