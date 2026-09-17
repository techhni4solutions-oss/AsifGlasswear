import express from 'express';
import { dbGet, dbRun } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM settings WHERE id = 1');
    if (!row) {
      return res.status(404).json({ error: 'Settings not found' });
    }
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings (Admin)
router.put('/', authenticateToken, async (req, res) => {
  try {
    const { company_name, phone, whatsapp, email, address, map_lat, map_lon, gmaps_link, hero_title, hero_subtitle } = req.body;
    
    await dbRun(`
      UPDATE settings
      SET company_name = ?, phone = ?, whatsapp = ?, email = ?, address = ?, map_lat = ?, map_lon = ?, gmaps_link = ?, hero_title = ?, hero_subtitle = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      company_name,
      phone,
      whatsapp,
      email,
      address,
      map_lat || 32.1577,
      map_lon || 74.1945,
      gmaps_link || `https://www.google.com/maps?q=${encodeURIComponent(address)}`,
      hero_title || 'Premium Aluminium & Glass Solutions',
      hero_subtitle || 'Crafting Architectural Elegance for Residential & Commercial Spaces in Pakistan'
    ]);

    const updated = await dbGet('SELECT * FROM settings WHERE id = 1');
    res.json(updated);
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
