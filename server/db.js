import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'database.sqlite');
const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(dbPath);

// Helper functions for Promise-based queries
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initial database setup and schema creation
export async function initDb() {
  console.log('Initializing SQLite database schema...');

  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS projects (
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
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      project TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      review TEXT NOT NULL,
      avatar TEXT,
      published INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS inquiries (
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
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      projects INTEGER DEFAULT 0,
      lastInquiry TEXT,
      status TEXT DEFAULT 'Active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS settings (
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
    )
  `);

  await seedData();
}

async function seedData() {
  // Check admin user
  const admin = await dbGet('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await dbRun('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin']);
    console.log('Seeded default admin account (username: admin, password: admin123)');
  }

  // Seed settings
  const settingsCount = await dbGet('SELECT COUNT(*) as count FROM settings');
  if (settingsCount.count === 0) {
    await dbRun(`
      INSERT INTO settings (id, company_name, phone, whatsapp, email, address, map_lat, map_lon, gmaps_link, hero_title, hero_subtitle)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Asif Glass & Aluminium',
      '0306 642 6139',
      '0306 642 6139',
      'info@asifglass.pk',
      'Ghulam Dastagir Khan Rd, Block-D Satellite Town, Gujranwala 52250, Pakistan',
      32.1577,
      74.1945,
      'https://www.google.com/maps?q=Ghulam+Dastagir+Khan+Rd,+Block-D+Satellite+Town,+Gujranwala+52250,+Pakistan',
      'Premium Aluminium & Glass Solutions',
      'Crafting Architectural Elegance for Residential & Commercial Spaces in Pakistan'
    ]);
    console.log('Seeded default site settings');
  }

  // Seed projects if empty
  const projectCount = await dbGet('SELECT COUNT(*) as count FROM projects');
  if (projectCount.count === 0) {
    const initialProjects = [
      {
        name: "Al Barsha Commercial Tower",
        category: "Commercial",
        type: "Building Facade",
        location: "Gujranwala, Pakistan",
        date: "March 2024",
        status: "Completed",
        featured: 1,
        image: "https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?w=800&h=600&fit=crop&auto=format",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1481026469463-66327c86e544?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1523477593243-78bbf626fd3b?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1490351267196-b7a67e26e41b?w=800&h=600&fit=crop&auto=format"
        ]),
        description: "Complete aluminium curtain wall facade system for a 24-storey commercial tower. High-performance thermally broken profiles with triple-glazed units for optimal energy efficiency.",
        services: JSON.stringify(["Building Facade", "Curtain Wall System", "Sun Shading"]),
        materials: JSON.stringify(["6063-T5 Aluminium Profiles", "Triple-Glazed Units", "Structural Silicone"])
      },
      {
        name: "DHA Phase 5, Lahore Villa Complex",
        category: "Residential",
        type: "Windows & Doors",
        location: "Gujranwala, Pakistan",
        date: "January 2024",
        status: "Completed",
        featured: 1,
        image: "https://images.unsplash.com/photo-1565261949232-3fcc78206c0c?w=800&h=600&fit=crop&auto=format",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1702724758750-9ff8d50f02e5?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1778731525488-9f5789824278?w=800&h=600&fit=crop&auto=format"
        ]),
        description: "Premium aluminium sliding windows and pivot doors for a luxury villa complex of 12 units. Powder-coated anthracite grey finish with double-glazed argon-filled units.",
        services: JSON.stringify(["Aluminium Windows", "Aluminium Doors", "Sliding Doors"]),
        materials: JSON.stringify(["Thermally Broken Profiles", "Double-Glazed Units", "Powder Coat Finish"])
      },
      {
        name: "Downtown Office Fit-Out",
        category: "Commercial",
        type: "Glass Partitions",
        location: "Lahore, Pakistan",
        date: "November 2023",
        status: "Completed",
        featured: 1,
        image: "https://images.unsplash.com/photo-1705909773171-4ba952b9c0af?w=800&h=600&fit=crop&auto=format",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1770425910016-4b1b45991db9?w=800&h=600&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1770048532712-4fde5ef7eb90?w=800&h=600&fit=crop&auto=format"
        ]),
        description: "Full-floor office fit-out featuring frameless glass partitioning system, integrated acoustic doors, and frosted privacy bands.",
        services: JSON.stringify(["Glass Partitions", "Glass Doors", "Acoustic Solutions"]),
        materials: JSON.stringify(["12mm Tempered Glass", "Frameless Fittings", "Smart Film"])
      },
      {
        name: "Main Boulevard, Lahore Shopfronts",
        category: "Commercial",
        type: "Shop Fronts",
        location: "Faisalabad, Pakistan",
        date: "September 2023",
        status: "Completed",
        featured: 0,
        image: "https://images.unsplash.com/photo-1549492761-123cdcb927aa?w=800&h=600&fit=crop&auto=format",
        gallery: JSON.stringify([]),
        description: "Contemporary shopfront systems for a retail promenade of 18 units. Full-height glazing with automatic sliding entrance doors.",
        services: JSON.stringify(["Shop Fronts", "Automatic Doors", "Glass"]),
        materials: JSON.stringify(["Anodised Aluminium", "Laminated Safety Glass", "Automatic Door Systems"])
      },
      {
        name: "Cavalry Ground, Lahore Luxury Penthouse",
        category: "Residential",
        type: "Glass Railings",
        location: "Gujranwala, Pakistan",
        date: "August 2023",
        status: "Completed",
        featured: 0,
        image: "https://images.unsplash.com/photo-1479292889369-1a48f234247e?w=800&h=600&fit=crop&auto=format",
        gallery: JSON.stringify([]),
        description: "Bespoke frameless glass balustrade and railing system for a penthouse spanning three levels. 17mm heat-soaked tempered glass panels.",
        services: JSON.stringify(["Glass Railings", "Balustrade", "Custom Glass Work"]),
        materials: JSON.stringify(["17mm Heat-Soaked Glass", "316 Stainless Steel", "Base Shoe Channels"])
      },
      {
        name: "Satellite Town, Gujranwala Hotel Tower",
        category: "Commercial",
        type: "Building Facade",
        location: "Gujranwala, Pakistan",
        date: "June 2023",
        status: "Completed",
        featured: 0,
        image: "https://images.unsplash.com/photo-1479293581560-aee98bb24f7f?w=800&h=600&fit=crop&auto=format",
        gallery: JSON.stringify([]),
        description: "Unitized curtain wall system for a 32-storey hotel tower. High-performance vision glass with integrated opaque spandrel units.",
        services: JSON.stringify(["Building Facade", "Curtain Wall", "Spandrel Panels"]),
        materials: JSON.stringify(["Unitized Aluminium System", "Low-E Glass", "Back-Painted Glass"])
      }
    ];

    for (const p of initialProjects) {
      await dbRun(`
        INSERT INTO projects (name, category, type, location, date, status, featured, image, gallery, description, services, materials)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.name, p.category, p.type, p.location, p.date, p.status, p.featured, p.image, p.gallery, p.description, p.services, p.materials]);
    }
    console.log('Seeded projects');
  }

  // Seed services if empty
  const serviceCount = await dbGet('SELECT COUNT(*) as count FROM services');
  if (serviceCount.count === 0) {
    const initialServices = [
      { name: "Aluminium Windows", icon: "🪟", description: "Thermally broken aluminium windows in casement, sliding, awning, and tilt-turn configurations. Custom sizes and powder-coat colours available.", image: "https://images.unsplash.com/photo-1702724758750-9ff8d50f02e5?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Aluminium Doors", icon: "🚪", description: "Pivot, hinged, and folding aluminium door systems. Heavy-duty hardware and multi-point locking for residential and commercial applications.", image: "https://images.unsplash.com/photo-1549492761-123cdcb927aa?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Sliding Doors", icon: "↔️", description: "Smooth-glide large-format sliding door systems. Minimal frame profiles for maximum glass area and unobstructed views.", image: "https://images.unsplash.com/photo-1565261949232-3fcc78206c0c?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Glass Doors", icon: "🔲", description: "Frameless and semi-frameless glass door solutions including patch fittings, patch locks, and floor springs for a clean minimal aesthetic.", image: "https://images.unsplash.com/photo-1778731525488-9f5789824278?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Glass Partitions", icon: "🏢", description: "Single and double-glazed partition systems for offices, showrooms, and hospitality spaces. Acoustic performance up to 52 dB Rw.", image: "https://images.unsplash.com/photo-1705909773171-4ba952b9c0af?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Glass Railings", icon: "🛡️", description: "Frameless and semi-frameless glass balustrade systems for staircases, balconies, and mezzanines. Compliant with building codes.", image: "https://images.unsplash.com/photo-1479292889369-1a48f234247e?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Shop Fronts", icon: "🏪", description: "High-impact commercial shopfront systems designed for visibility and security. Automatic sliding, swing, or folding entrance options.", image: "https://images.unsplash.com/photo-1490351267196-b7a67e26e41b?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Building Facades", icon: "🏗️", description: "Stick-built and unitized curtain wall systems for commercial towers and mixed-use developments. Full design and engineering support.", image: "https://images.unsplash.com/photo-1690944851207-3f288c8fcd0b?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Shower Cabins", icon: "🚿", description: "Custom frameless shower enclosures in clear, frosted, or patterned glass. Brushed nickel, chrome, or matte black hardware finishes.", image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600&h=400&fit=crop&auto=format", status: "Active" },
      { name: "Custom Glass Work", icon: "✨", description: "Bespoke glass features including mirrors, splashbacks, feature walls, canopies, and structural glass floors.", image: "https://images.unsplash.com/photo-1584257354413-32f8603c40fe?w=600&h=400&fit=crop&auto=format", status: "Active" }
    ];

    for (const s of initialServices) {
      await dbRun('INSERT INTO services (name, icon, description, image, status) VALUES (?, ?, ?, ?, ?)', [s.name, s.icon, s.description, s.image, s.status]);
    }
    console.log('Seeded services');
  }

  // Seed testimonials if empty
  const testimonialCount = await dbGet('SELECT COUNT(*) as count FROM testimonials');
  if (testimonialCount.count === 0) {
    const initialTestimonials = [
      { name: "Mohammed Al Rashidi", project: "Villa Complex — Bahria Town, Lahore", rating: 5, review: "Outstanding quality and professionalism. The sliding doors and windows they installed have transformed our villa completely. The powder-coat finish is perfect.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format", published: 1 },
      { name: "Sarah Thompson", project: "Office Fit-Out — Gulberg III, Lahore", rating: 5, review: "We needed a glass partitioning system for our headquarters and Asif Glass & Aluminium delivered beyond expectations. On time and clean installation.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&auto=format", published: 1 },
      { name: "Khalid Al Mansoori", project: "Penthouse — Cavalry Ground, Lahore", rating: 5, review: "The frameless glass railings they installed on our three terraces are breathtaking. The team was meticulous — every panel is perfectly level.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format", published: 1 },
      { name: "Rania Haddad", project: "Retail Shopfront — Liberty Market, Lahore", rating: 5, review: "Our new shopfront is exactly what we envisioned. The automatic sliding doors and full-height glazing give us incredible visibility.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format", published: 1 }
    ];

    for (const t of initialTestimonials) {
      await dbRun('INSERT INTO testimonials (name, project, rating, review, avatar, published) VALUES (?, ?, ?, ?, ?, ?)', [t.name, t.project, t.rating, t.review, t.avatar, t.published]);
    }
    console.log('Seeded testimonials');
  }

  // Seed inquiries if empty
  const inquiryCount = await dbGet('SELECT COUNT(*) as count FROM inquiries');
  if (inquiryCount.count === 0) {
    const initialInquiries = [
      { name: "Ahmed Hassan", phone: "+92 300 234 5678", email: "ahmed.h@email.com", projectType: "Glass Partitions", location: "DHA, Lahore", message: "Need glass partition system for 500sqm office floor. Looking for acoustic solution.", date: "15 Sep 2026", status: "New" },
      { name: "Fatima Al Zaabi", phone: "+92 301 876 5432", email: "fatima.z@email.com", projectType: "Aluminium Windows", location: "Gulberg, Lahore", message: "Replacement windows for 4-bedroom villa. Interested in thermally broken profiles.", date: "14 Sep 2026", status: "Contacted" },
      { name: "James Carter", phone: "+92 302 111 9876", email: "j.carter@company.pk", projectType: "Building Facade", location: "Satellite Town, Gujranwala", message: "Commercial tower project, 18 floors. Need curtain wall system quote.", date: "13 Sep 2026", status: "Quoted" }
    ];

    for (const inq of initialInquiries) {
      await dbRun('INSERT INTO inquiries (name, phone, email, projectType, location, message, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [inq.name, inq.phone, inq.email, inq.projectType, inq.location, inq.message, inq.date, inq.status]);
    }
    console.log('Seeded inquiries');
  }

  // Seed customers if empty
  const customerCount = await dbGet('SELECT COUNT(*) as count FROM customers');
  if (customerCount.count === 0) {
    const initialCustomers = [
      { name: "Mohammed Al Rashidi", phone: "+92 300 234 5678", email: "m.rashidi@email.com", projects: 2, lastInquiry: "15 Sep 2026", status: "Active" },
      { name: "Sarah Thompson", phone: "+92 301 876 5432", email: "s.thompson@company.pk", projects: 1, lastInquiry: "14 Sep 2026", status: "Active" },
      { name: "Khalid Al Mansoori", phone: "+92 302 111 9876", email: "k.mansoori@email.com", projects: 3, lastInquiry: "10 Sep 2026", status: "Active" }
    ];

    for (const c of initialCustomers) {
      await dbRun('INSERT INTO customers (name, phone, email, projects, lastInquiry, status) VALUES (?, ?, ?, ?, ?, ?)', [c.name, c.phone, c.email, c.projects, c.lastInquiry, c.status]);
    }
    console.log('Seeded customers');
  }
}
