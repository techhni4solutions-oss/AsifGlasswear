import express from 'express';
import multer from 'multer';

// Use memory storage so we can convert to base64 data URI.
// This ensures images survive Render's ephemeral filesystem restarts.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Convert file buffer to a base64 data URI so the image data lives
  // inside the database record instead of on the ephemeral filesystem.
  const mimeType = req.file.mimetype || 'image/jpeg';
  const base64 = req.file.buffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;

  res.json({ url: dataUri, filename: req.file.originalname });
});

export default router;
