import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'ariawed.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'bride',
    wedding_id TEXT,
    vendor_id TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS weddings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT,
    location TEXT,
    guest_count INTEGER DEFAULT 0,
    budget INTEGER DEFAULT 0,
    priorities TEXT,
    styles TEXT,
    culture TEXT,
    partner_email TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS guests (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    side TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    relationship TEXT,
    "group" TEXT NOT NULL,
    plus_one_allowed INTEGER DEFAULT 0,
    rsvp_status TEXT DEFAULT 'pending',
    meal_preference TEXT,
    dietary_restrictions TEXT,
    plus_one_name TEXT,
    children_count INTEGER DEFAULT 0,
    children_details TEXT,
    table_id TEXT,
    rsvp_token TEXT UNIQUE NOT NULL,
    gift_received TEXT,
    thank_you_sent INTEGER DEFAULT 0,
    updated_at TEXT,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
  );

  CREATE TABLE IF NOT EXISTS budget_categories (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    name TEXT NOT NULL,
    allocated INTEGER NOT NULL,
    spent INTEGER DEFAULT 0,
    notes TEXT,
    is_paid INTEGER DEFAULT 0,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    wedding_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    due_date TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'not_started',
    description TEXT,
    completed_at TEXT,
    is_custom INTEGER DEFAULT 0,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
  );

  CREATE TABLE IF NOT EXISTS website (
    wedding_id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    FOREIGN KEY (wedding_id) REFERENCES weddings(id)
  );

  CREATE INDEX IF NOT EXISTS idx_guests_wedding ON guests(wedding_id);
  CREATE INDEX IF NOT EXISTS idx_guests_rsvp_token ON guests(rsvp_token);
  CREATE INDEX IF NOT EXISTS idx_budget_wedding ON budget_categories(wedding_id);
  CREATE INDEX IF NOT EXISTS idx_tasks_wedding ON tasks(wedding_id);
`);

console.log('Database initialized at', dbPath);
db.close();
