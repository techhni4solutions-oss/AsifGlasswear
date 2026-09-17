import express from 'express';
import { dbAll, dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatTestimonial(t) {
  if (!t) return null;
  return {
    ...t,
    published: Boolean(t.published)
  };
}

// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM testimonials ORDER BY id DESC');
    res.json(rows.map(formatTestimonial));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// POST /api/testimonials (Public or Admin)
router.post('/', async (req, res) => {
  try {
    const { name, project, rating, review, avatar, published } = req.body;
    if (!name || !review) {
      return res.status(400).json({ error: 'Name and review are required' });
    }

    const isPublished = published !== undefined ? (published ? 1 : 0) : 1;

    const result = await dbRun(`
      INSERT INTO testimonials (name, project, rating, review, avatar, published)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      name,
      project || 'General Project',
      rating || 5,
      review,
      avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&auto=format',
      isPublished
    ]);

    const created = await dbGet('SELECT * FROM testimonials WHERE id = ?', [result.id]);
    res.status(201).json(formatTestimonial(created));
  } catch (err) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// PUT /api/testimonials/:id (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, project, rating, review, avatar, published } = req.body;
    await dbRun(`
      UPDATE testimonials
      SET name = ?, project = ?, rating = ?, review = ?, avatar = ?, published = ?
      WHERE id = ?
    `, [name, project, rating, review, avatar, published ? 1 : 0, req.params.id]);

    const updated = await dbGet('SELECT * FROM testimonials WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(formatTestimonial(updated));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

// DELETE /api/testimonials/:id (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
