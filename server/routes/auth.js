import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { JWT_SECRET } from '../middleware/auth.js';

const router = Router();

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'bride' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }
    const id = uuid();
    const password_hash = await bcrypt.hash(password, 10);
    db.prepare(`
      INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)
    `).run(id, email.toLowerCase(), password_hash, name, role);
    const user = db.prepare('SELECT id, email, name, role, wedding_id, vendor_id, status FROM users WHERE id = ?').get(id);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        weddingId: user.wedding_id,
        vendorId: user.vendor_id,
        status: user.status,
      },
      token,
    });
  } catch (e) {
    if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!row) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign(
    { id: row.id, email: row.email, role: row.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({
    user: {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      weddingId: row.wedding_id,
      vendorId: row.vendor_id,
      status: row.status,
    },
    token,
  });
});

export default router;
