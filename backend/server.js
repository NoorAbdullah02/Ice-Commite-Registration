// Banglish comments sudhu
// Ei file Express server setup kore aar routes attach kore

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import registerRoute from './routes/register.js';
import adminLoginRoute from './routes/adminLogin.js';
import studentsRoute from './routes/students.js';
import selectRoute from './routes/select.js';
import uploadRoute from './routes/upload.js';
import updatePostRoute from './routes/updatePost.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // cookies allow kore
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files serve kore (frontend files)
app.use(express.static('frontend'));

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
