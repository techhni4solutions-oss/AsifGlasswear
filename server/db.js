import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

// Turso (free hosted SQLite) — set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Render env vars
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// ─── Helper wrappers (same interface as before) ───────────────────────────────

export const dbRun = async (sql, params = []) => {
  const result = await client.execute({ sql, args: params });
  return { id: Number(result.lastInsertRowid), changes: result.rowsAffected };
};

export const dbGet = async (sql, params = []) => {
  const result = await client.execute({ sql, args: params });
  if (!result.rows || result.rows.length === 0) return null;
  // Convert libsql Row to plain object
  return Object.fromEntries(
    result.columns.map((col, i) => [col, result.rows[0][i]])
  );
};

export const dbAll = async (sql, params = []) => {
  const result = await client.execute({ sql, args: params });
  return result.rows.map((row) =>
    Object.fromEntries(result.columns.map((col, i) => [col, row[i]]))
  );
};

// ─── Init & seed ──────────────────────────────────────────────────────────────

let isInitialized = false;

export async function initDb() {
  if (isInitialized) return;

  try {
    console.log('Initializing Turso database schema...');

    await client.batch([
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        location TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        featured INTEGER DEFAULT 0,
        image TEXT NOT NULL,
        gallery TEXT DEFAULT '[]',
        description TEXT NOT NULL,
        services TEXT DEFAULT '[]',
        materials TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        project TEXT NOT NULL,
        rating INTEGER DEFAULT 5,
        review TEXT NOT NULL,
        avatar TEXT,
        published INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS inquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        projectType TEXT NOT NULL,
        location TEXT,
        message TEXT,
        attachment TEXT,
        date TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        projects INTEGER DEFAULT 0,
        lastInquiry TEXT,
        status TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        company_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        map_lat REAL DEFAULT 32.1577,
        map_lon REAL DEFAULT 74.1945,
        gmaps_link TEXT,
        hero_title TEXT,
        hero_subtitle TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ], 'deferred');

    await seedData();
    isInitialized = true;
    console.log('Database ready ✅');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}

async function seedData() {
  // Admin user
  const admin = await dbGet('SELECT id FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    await dbRun('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashed, 'admin']);
    console.log('Seeded admin account — username: admin  password: admin123');
  }

  // Settings
  const st = await dbGet('SELECT COUNT(*) as count FROM settings', []);
  if (!st || Number(st.count) === 0) {
    await dbRun(
      `INSERT INTO settings (id, company_name, phone, whatsapp, email, address, map_lat, map_lon, gmaps_link, hero_title, hero_subtitle)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Asif Glass & Aluminium',
        '0306 642 6139',
        '0306 642 6139',
        'info@asifglass.pk',
        'Ghulam Dastagir Khan Rd, Block-D Satellite Town, Gujranwala 52250, Pakistan',
        32.1577,
        74.1945,
        'https://www.google.com/maps?q=Ghulam+Dastagir+Khan+Rd,+Block-D+Satellite+Town,+Gujranwala+52250,+Pakistan',
        'Premium Aluminium & Glass Solutions',
        'Crafting Architectural Elegance for Residential & Commercial Spaces in Pakistan',
      ]
    );
  }

  // Projects
  const pc = await dbGet('SELECT COUNT(*) as count FROM projects', []);
  if (!pc || Number(pc.count) === 0) {
    const projects = [
      {
        name: 'Al Barsha Commercial Tower', category: 'Commercial', type: 'Building Facade',
        location: 'Gujranwala, Pakistan', date: 'March 2024', status: 'Completed', featured: 1,
        image: 'https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?w=800&h=600&fit=crop&auto=format',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1481026469463-66327c86e544?w=800&h=600&fit=crop&auto=format']),
        description: 'Complete aluminium curtain wall facade system for a 24-storey commercial tower.',
        services: JSON.stringify(['Building Facade', 'Curtain Wall System', 'Sun Shading']),
        materials: JSON.stringify(['6063-T5 Aluminium Profiles', 'Triple-Glazed Units', 'Structural Silicone']),
      },
      {
        name: 'DHA Phase 5, Lahore Villa Complex', category: 'Residential', type: 'Windows & Doors',
        location: 'Gujranwala, Pakistan', date: 'January 2024', status: 'Completed', featured: 1,
        image: 'https://images.unsplash.com/photo-1565261949232-3fcc78206c0c?w=800&h=600&fit=crop&auto=format',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1702724758750-9ff8d50f02e5?w=800&h=600&fit=crop&auto=format']),
        description: 'Premium aluminium sliding windows and pivot doors for a luxury villa complex of 12 units.',
        services: JSON.stringify(['Aluminium Windows', 'Aluminium Doors', 'Sliding Doors']),
        materials: JSON.stringify(['Thermally Broken Profiles', 'Double-Glazed Units', 'Powder Coat Finish']),
      },
      {
        name: 'Downtown Office Fit-Out', category: 'Commercial', type: 'Glass Partitions',
        location: 'Lahore, Pakistan', date: 'November 2023', status: 'Completed', featured: 1,
        image: 'https://images.unsplash.com/photo-1705909773171-4ba952b9c0af?w=800&h=600&fit=crop&auto=format',
        gallery: JSON.stringify(['https://images.unsplash.com/photo-1770425910016-4b1b45991db9?w=800&h=600&fit=crop&auto=format']),
        description: 'Full-floor office fit-out featuring frameless glass partitioning system.',
        services: JSON.stringify(['Glass Partitions', 'Glass Doors', 'Acoustic Solutions']),
        materials: JSON.stringify(['12mm Tempered Glass', 'Frameless Fittings', 'Smart Film']),
      },
    ];
    for (const p of projects) {
      await dbRun(
        `INSERT INTO projects (name, category, type, location, date, status, featured, image, gallery, description, services, materials)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.category, p.type, p.location, p.date, p.status, p.featured, p.image, p.gallery, p.description, p.services, p.materials]
      );
    }
  }

  // Services
  const sc = await dbGet('SELECT COUNT(*) as count FROM services', []);
  if (!sc || Number(sc.count) === 0) {
    const svcs = [
      { name: 'Aluminium Windows', icon: '🪟', description: 'Thermally broken aluminium windows in casement, sliding, awning, and tilt-turn configurations.', image: 'https://images.unsplash.com/photo-1702724758750-9ff8d50f02e5?w=600&h=400&fit=crop&auto=format', status: 'Active' },
      { name: 'Aluminium Doors', icon: '🚪', description: 'Pivot, hinged, and folding aluminium door systems. Heavy-duty hardware and multi-point locking.', image: 'https://images.unsplash.com/photo-1549492761-123cdcb927aa?w=600&h=400&fit=crop&auto=format', status: 'Active' },
      { name: 'Sliding Doors', icon: '↔️', description: 'Smooth-glide large-format sliding door systems. Minimal frame profiles for maximum glass area.', image: 'https://images.unsplash.com/photo-1565261949232-3fcc78206c0c?w=600&h=400&fit=crop&auto=format', status: 'Active' },
      { name: 'Glass Doors', icon: '🔲', description: 'Frameless and semi-frameless glass door solutions including patch fittings and floor springs.', image: 'https://images.unsplash.com/photo-1778731525488-9f5789824278?w=600&h=400&fit=crop&auto=format', status: 'Active' },
      { name: 'Glass Partitions', icon: '🏢', description: 'Single and double-glazed partition systems for offices, showrooms, and hospitality spaces.', image: 'https://images.unsplash.com/photo-1705909773171-4ba952b9c0af?w=600&h=400&fit=crop&auto=format', status: 'Active' },
    ];
    for (const s of svcs) {
      await dbRun('INSERT INTO services (name, icon, description, image, status) VALUES (?, ?, ?, ?, ?)', [s.name, s.icon, s.description, s.image, s.status]);
    }
  }

  // Testimonials
  const tc = await dbGet('SELECT COUNT(*) as count FROM testimonials', []);
  if (!tc || Number(tc.count) === 0) {
    const testimonials = [
      { name: 'Mohammed Al Rashidi', project: 'Villa Complex — Bahria Town, Lahore', rating: 5, review: 'Outstanding quality and professionalism. The sliding doors and windows they installed transformed our villa completely.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format', published: 1 },
      { name: 'Sarah Thompson', project: 'Office Fit-Out — Gulberg III, Lahore', rating: 5, review: 'We needed a glass partitioning system and Asif Glass & Aluminium delivered beyond expectations.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&auto=format', published: 1 },
    ];
    for (const t of testimonials) {
      await dbRun('INSERT INTO testimonials (name, project, rating, review, avatar, published) VALUES (?, ?, ?, ?, ?, ?)', [t.name, t.project, t.rating, t.review, t.avatar, t.published]);
    }
  }
}
