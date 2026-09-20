import express from 'express';
import cors from 'cors';
import { initDb } from '../server/db.js';

import authRoutes from '../server/routes/auth.js';
import projectRoutes from '../server/routes/projects.js';
import serviceRoutes from '../server/routes/services.js';
import testimonialRoutes from '../server/routes/testimonials.js';
import inquiryRoutes from '../server/routes/inquiries.js';
import customerRoutes from '../server/routes/customers.js';
import settingsRoutes from '../server/routes/settings.js';
import uploadRoutes from '../server/routes/upload.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(async (req, res, next) => {
  try {
    await initDb();
  } catch (err) {
    console.error('Database initialization error:', err);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Vercel Serverless' });
});

export default app;
