import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
}

router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT id, user_id as userId, date, location, guest_count as guestCount, budget, priorities, styles, culture, partner_email as partnerEmail, created_at as createdAt
    FROM weddings WHERE user_id = ?
  `).all(req.user.id);
  const weddings = rows.map(r => ({
    ...r,
    priorities: r.priorities ? JSON.parse(r.priorities) : [],
    styles: r.styles ? JSON.parse(r.styles) : [],
  }));
  res.json(weddings);
});

router.post('/', (req, res) => {
  const id = uuid();
  const { date, location, guestCount = 0, budget = 0, priorities = [], styles = [], culture, partnerEmail } = req.body;
  db.prepare(`
    INSERT INTO weddings (id, user_id, date, location, guest_count, budget, priorities, styles, culture, partner_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, req.user.id, date || null, location || null, guestCount, budget,
    JSON.stringify(priorities), JSON.stringify(styles), culture || null, partnerEmail || null
  );
  const row = db.prepare('SELECT id, user_id as userId, date, location, guest_count as guestCount, budget, priorities, styles, culture, partner_email as partnerEmail FROM weddings WHERE id = ?').get(id);
  const wedding = {
    ...row,
    priorities: row.priorities ? JSON.parse(row.priorities) : [],
    styles: row.styles ? JSON.parse(row.styles) : [],
  };
  db.prepare('UPDATE users SET wedding_id = ? WHERE id = ?').run(id, req.user.id);
  res.status(201).json(wedding);
});

router.get('/:id', (req, res) => {
  const row = db.prepare(`
    SELECT id, user_id as userId, date, location, guest_count as guestCount, budget, priorities, styles, culture, partner_email as partnerEmail
    FROM weddings WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Wedding not found' });
  res.json({
    ...row,
    priorities: row.priorities ? JSON.parse(row.priorities) : [],
    styles: row.styles ? JSON.parse(row.styles) : [],
  });
});

router.patch('/:id', (req, res) => {
  const { date, location, guestCount, budget, priorities, styles, culture, partnerEmail } = req.body;
  const row = db.prepare('SELECT id FROM weddings WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Wedding not found' });
  const updates = [];
  const values = [];
  if (date !== undefined) { updates.push('date = ?'); values.push(date); }
  if (location !== undefined) { updates.push('location = ?'); values.push(location); }
  if (guestCount !== undefined) { updates.push('guest_count = ?'); values.push(guestCount); }
  if (budget !== undefined) { updates.push('budget = ?'); values.push(budget); }
  if (priorities !== undefined) { updates.push('priorities = ?'); values.push(JSON.stringify(priorities)); }
  if (styles !== undefined) { updates.push('styles = ?'); values.push(JSON.stringify(styles)); }
  if (culture !== undefined) { updates.push('culture = ?'); values.push(culture); }
  if (partnerEmail !== undefined) { updates.push('partner_email = ?'); values.push(partnerEmail); }
  if (updates.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE weddings SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  const updated = db.prepare('SELECT id, user_id as userId, date, location, guest_count as guestCount, budget, priorities, styles, culture, partner_email as partnerEmail FROM weddings WHERE id = ?').get(req.params.id);
  res.json({
    ...updated,
    priorities: updated.priorities ? JSON.parse(updated.priorities) : [],
    styles: updated.styles ? JSON.parse(updated.styles) : [],
  });
});

export default router;
