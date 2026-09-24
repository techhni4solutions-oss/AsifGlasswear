import express from 'express';
import { dbAll, dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper: safely parse JSON field
function safeParseJson(val, fallback = []) {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

// Format a service row so `images` is always a proper array
function formatService(row) {
  if (!row) return null;
  return {
    ...row,
    images: safeParseJson(row.images, []),
  };
}

// GET /api/services
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM services ORDER BY id ASC');
    res.json(rows.map(formatService));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Service not found' });
    res.json(formatService(row));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST /api/services (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, icon, description, image, images, status } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

    const result = await dbRun(`
      INSERT INTO services (name, icon, description, image, images, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, icon || '✨', description, image || '', imagesJson, status || 'Active']);

    const created = await dbGet('SELECT * FROM services WHERE id = ?', [result.id]);
    res.status(201).json(formatService(created));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// PUT /api/services/:id (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, icon, description, image, images, status } = req.body;

    const imagesJson = JSON.stringify(Array.isArray(images) ? images : []);

    await dbRun(`
      UPDATE services
      SET name = ?, icon = ?, description = ?, image = ?, images = ?, status = ?
      WHERE id = ?
    `, [name, icon, description, image, imagesJson, status, req.params.id]);

    const updated = await dbGet('SELECT * FROM services WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Service not found' });
    res.json(formatService(updated));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

// DELETE /api/services/:id (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM services WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
