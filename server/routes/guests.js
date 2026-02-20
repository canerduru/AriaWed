import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
}

function rowToGuest(r) {
  return {
    id: r.id,
    weddingId: r.wedding_id,
    side: r.side,
    fullName: r.full_name,
    email: r.email,
    phone: r.phone,
    address: r.address,
    relationship: r.relationship,
    group: r.group,
    plusOneAllowed: !!r.plus_one_allowed,
    rsvpStatus: r.rsvp_status,
    mealPreference: r.meal_preference,
    dietaryRestrictions: r.dietary_restrictions,
    plusOneName: r.plus_one_name,
    childrenCount: r.children_count || 0,
    childrenDetails: r.children_details ? JSON.parse(r.children_details) : undefined,
    tableId: r.table_id,
    rsvpToken: r.rsvp_token,
    giftReceived: r.gift_received,
    thankYouSent: !!r.thank_you_sent,
    updatedAt: r.updated_at,
  };
}

function canAccessWedding(userId, weddingId) {
  const w = db.prepare('SELECT id FROM weddings WHERE id = ? AND user_id = ?').get(weddingId, userId);
  return !!w;
}

// Public RSVP by token (no auth)
router.get('/rsvp/:token', (req, res) => {
  const row = db.prepare('SELECT * FROM guests WHERE rsvp_token = ?').get(req.params.token);
  if (!row) return res.status(404).json({ error: 'Guest not found' });
  res.json(rowToGuest(row));
});

router.put('/rsvp/:token', (req, res) => {
  const { rsvpStatus, mealPreference, dietaryRestrictions, plusOneName, childrenCount, childrenDetails } = req.body;
  const row = db.prepare('SELECT * FROM guests WHERE rsvp_token = ?').get(req.params.token);
  if (!row) return res.status(404).json({ error: 'Guest not found' });
  const updates = [];
  const values = [];
  if (rsvpStatus !== undefined) { updates.push('rsvp_status = ?'); values.push(rsvpStatus); }
  if (mealPreference !== undefined) { updates.push('meal_preference = ?'); values.push(mealPreference); }
  if (dietaryRestrictions !== undefined) { updates.push('dietary_restrictions = ?'); values.push(dietaryRestrictions); }
  if (plusOneName !== undefined) { updates.push('plus_one_name = ?'); values.push(plusOneName); }
  if (childrenCount !== undefined) { updates.push('children_count = ?'); values.push(childrenCount); }
  if (childrenDetails !== undefined) { updates.push('children_details = ?'); values.push(JSON.stringify(childrenDetails)); }
  updates.push("updated_at = datetime('now')");
  values.push(req.params.token);
  db.prepare(`UPDATE guests SET ${updates.join(', ')} WHERE rsvp_token = ?`).run(...values);
  const updated = db.prepare('SELECT * FROM guests WHERE rsvp_token = ?').get(req.params.token);
  res.json(rowToGuest(updated));
});

// Authenticated guest CRUD
router.use(authMiddleware);

router.get('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const rows = db.prepare('SELECT * FROM guests WHERE wedding_id = ?').all(req.params.weddingId);
  res.json(rows.map(rowToGuest));
});

router.post('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const id = uuid();
  const rsvpToken = uuid().replace(/-/g, '').slice(0, 12);
  const g = req.body;
  db.prepare(`
    INSERT INTO guests (id, wedding_id, side, full_name, email, phone, address, relationship, "group", plus_one_allowed, rsvp_status, meal_preference, dietary_restrictions, plus_one_name, children_count, children_details, rsvp_token)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, req.params.weddingId, g.side || 'bride', g.fullName || g.full_name || '', g.email, g.phone, g.address, g.relationship, g.group || 'other',
    g.plusOneAllowed ? 1 : 0, g.rsvpStatus || 'pending', g.mealPreference, g.dietaryRestrictions, g.plusOneName, g.childrenCount || 0,
    g.childrenDetails ? JSON.stringify(g.childrenDetails) : null, rsvpToken
  );
  const row = db.prepare('SELECT * FROM guests WHERE id = ?').get(id);
  res.status(201).json(rowToGuest(row));
});

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT g.* FROM guests g JOIN weddings w ON g.wedding_id = w.id WHERE g.id = ? AND w.user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Guest not found' });
  const g = req.body;
  const updates = [];
  const values = [];
  const map = [
    ['side', g.side], ['full_name', g.fullName ?? g.full_name], ['email', g.email], ['phone', g.phone], ['address', g.address],
    ['relationship', g.relationship], ['group', g.group], ['plus_one_allowed', g.plusOneAllowed], ['rsvp_status', g.rsvpStatus],
    ['meal_preference', g.mealPreference], ['dietary_restrictions', g.dietaryRestrictions], ['plus_one_name', g.plusOneName],
    ['children_count', g.childrenCount], ['children_details', g.childrenDetails ? JSON.stringify(g.childrenDetails) : null], ['table_id', g.tableId],
  ];
  for (const [col, val] of map) {
    if (val !== undefined) {
      const sqlCol = col.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
      updates.push(`${sqlCol} = ?`);
      values.push(val === null || (typeof val === 'boolean' && !val) ? (col === 'plus_one_allowed' ? 0 : null) : (typeof val === 'boolean' ? (val ? 1 : 0) : val));
    }
  }
  if (updates.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE guests SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  const updated = db.prepare('SELECT * FROM guests WHERE id = ?').get(req.params.id);
  res.json(rowToGuest(updated));
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT g.id FROM guests g JOIN weddings w ON g.wedding_id = w.id WHERE g.id = ? AND w.user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Guest not found' });
  db.prepare('DELETE FROM guests WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
