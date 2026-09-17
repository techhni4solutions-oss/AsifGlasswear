import express from 'express';
import { dbAll, dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

function formatProject(p) {
  if (!p) return null;
  return {
    ...p,
    featured: Boolean(p.featured),
    gallery: p.gallery ? JSON.parse(p.gallery) : [],
    services: p.services ? JSON.parse(p.services) : [],
    materials: p.materials ? JSON.parse(p.materials) : []
  };
}

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM projects ORDER BY id DESC');
    res.json(rows.map(formatProject));
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({ error: 'Project not found' });
    res.json(formatProject(row));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST /api/projects (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, category, type, location, date, status, featured, image, gallery, description, services, materials } = req.body;
    if (!name || !category || !type) {
      return res.status(400).json({ error: 'Name, category, and type are required' });
    }

    const result = await dbRun(`
      INSERT INTO projects (name, category, type, location, date, status, featured, image, gallery, description, services, materials)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      category,
      type,
      location || '',
      date || 'New',
      status || 'Completed',
      featured ? 1 : 0,
      image || '',
      JSON.stringify(gallery || []),
      description || '',
      JSON.stringify(services || []),
      JSON.stringify(materials || [])
    ]);

    const created = await dbGet('SELECT * FROM projects WHERE id = ?', [result.id]);
    res.status(201).json(formatProject(created));
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT /api/projects/:id (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, category, type, location, date, status, featured, image, gallery, description, services, materials } = req.body;
    
    await dbRun(`
      UPDATE projects
      SET name = ?, category = ?, type = ?, location = ?, date = ?, status = ?, featured = ?, image = ?, gallery = ?, description = ?, services = ?, materials = ?
      WHERE id = ?
    `, [
      name,
      category,
      type,
      location,
      date,
      status,
      featured ? 1 : 0,
      image,
      JSON.stringify(gallery || []),
      description,
      JSON.stringify(services || []),
      JSON.stringify(materials || []),
      req.params.id
    ]);

    const updated = await dbGet('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(formatProject(updated));
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE /api/projects/:id (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM projects WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
