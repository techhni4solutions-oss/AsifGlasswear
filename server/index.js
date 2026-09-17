import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDb } from './db.js';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import serviceRoutes from './routes/services.js';
import testimonialRoutes from './routes/testimonials.js';
import inquiryRoutes from './routes/inquiries.js';
import customerRoutes from './routes/customers.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Serve static frontend assets in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Initialize database and start server
async function startServer() {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database or start server:', err);
  }
}

startServer();
