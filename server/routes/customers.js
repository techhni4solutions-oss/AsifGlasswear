import express from 'express';
import { dbAll, dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/customers (Admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM customers ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// POST /api/customers (Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, projects, lastInquiry, status } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const result = await dbRun(`
      INSERT INTO customers (name, phone, email, projects, lastInquiry, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, phone, email || '', projects || 1, lastInquiry || todayStr, status || 'Active']);

    const created = await dbGet('SELECT * FROM customers WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

// PUT /api/customers/:id (Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, projects, lastInquiry, status } = req.body;
    await dbRun(`
      UPDATE customers
      SET name = ?, phone = ?, email = ?, projects = ?, lastInquiry = ?, status = ?
      WHERE id = ?
    `, [name, phone, email, projects, lastInquiry, status, req.params.id]);

    const updated = await dbGet('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (!updated) return res.status(404).json({ error: 'Customer not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id (Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await dbRun('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.changes === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;
