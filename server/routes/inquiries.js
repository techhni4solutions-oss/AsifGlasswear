import express from 'express';
import { dbAll, dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/inquiries (Admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM inquiries ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// POST /api/inquiries (Public - Customer Quote Request)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, projectType, location, message, attachment } = req.body;
    if (!name || !phone || !projectType) {
      return res.status(400).json({ error: 'Name, phone, and project type are required' });
    }

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    const result = await dbRun(`
      INSERT INTO inquiries (name, phone, email, projectType, location, message, attachment, date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      phone,
      email || '',
      projectType,
      location || '',
      message || '',
      attachment || '',
      todayStr,
      'New'
    ]);

    // Automatically check or create/update Customer record
    const existingCustomer = await dbGet('SELECT * FROM customers WHERE phone = ? OR (email != "" AND email = ?)', [phone, email || '___never___']);
    if (existingCustomer) {
      await dbRun(`
        UPDATE customers
        SET projects = projects + 1, lastInquiry = ?, status = 'Active'
        WHERE id = ?
      `, [todayStr, existingCustomer.id]);
    } else {
      await dbRun(`
        INSERT INTO customers (name, phone, email, projects, lastInquiry, status)
        VALUES (?, ?, ?, 1, ?, 'Active')
      `, [name, phone, email || '', todayStr]);
    }

    const created = await dbGet('SELECT * FROM inquiries WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    console.error('Error creating inquiry:', err);
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

// PUT /api/inquiries/:id/status (Admin)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    await dbRun('UPDATE inquiries SET status = ? WHERE id = ?', [status, req.params.id]);
    const updated = await dbGet('SELECT * FROM inquiries WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry status' });
  }
});

// DELETE /api/inquiries/:id (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM inquiries WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;
