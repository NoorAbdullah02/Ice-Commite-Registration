// Banglish comments sudhu
// Ei file Express server setup kore aar routes attach kore

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import registerRoute from './routes/register.js';
import adminLoginRoute from './routes/adminLogin.js';
import studentsRoute from './routes/students.js';
import selectRoute from './routes/select.js';
import uploadRoute from './routes/upload.js';
import updatePostRoute from './routes/updatePost.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS Configuration
// Using `origin: true` reflects the request's origin.
// This is a permissive but effective way to handle CORS, especially for development.
app.use(cors({
  origin: true,
  credentials: true // cookies allow kore
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files serve kore (frontend files)
app.use(express.static(frontendPath));

// Routes
app.use('/api', registerRoute);
app.use('/api/admin', adminLoginRoute);
app.use('/api/students', studentsRoute);
app.use('/api/select', selectRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/update-post', updatePostRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Logout route
app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Register: http://localhost:${PORT}/`);
  console.log(`🔐 Admin: http://localhost:${PORT}/admin.html`);
});
