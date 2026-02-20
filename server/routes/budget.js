import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
}

function canAccessWedding(userId, weddingId) {
  const w = db.prepare('SELECT id FROM weddings WHERE id = ? AND user_id = ?').get(weddingId, userId);
  return !!w;
}

router.get('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const rows = db.prepare('SELECT id, wedding_id as weddingId, name, allocated, spent, notes, is_paid as isPaid FROM budget_categories WHERE wedding_id = ?').all(req.params.weddingId);
  res.json(rows.map(r => ({ ...r, isPaid: !!r.isPaid })));
});

router.post('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const id = uuid();
  const { name, allocated, spent = 0, notes, isPaid = false } = req.body;
  db.prepare(`
    INSERT INTO budget_categories (id, wedding_id, name, allocated, spent, notes, is_paid)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.params.weddingId, name, allocated || 0, spent, notes || null, isPaid ? 1 : 0);
  const row = db.prepare('SELECT id, wedding_id as weddingId, name, allocated, spent, notes, is_paid as isPaid FROM budget_categories WHERE id = ?').get(id);
  res.status(201).json({ ...row, isPaid: !!row.isPaid });
});

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT c.* FROM budget_categories c JOIN weddings w ON c.wedding_id = w.id WHERE c.id = ? AND w.user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Category not found' });
  const { name, allocated, spent, notes, isPaid } = req.body;
  const updates = [];
  const values = [];
  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (allocated !== undefined) { updates.push('allocated = ?'); values.push(allocated); }
  if (spent !== undefined) { updates.push('spent = ?'); values.push(spent); }
  if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
  if (isPaid !== undefined) { updates.push('is_paid = ?'); values.push(isPaid ? 1 : 0); }
  if (updates.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE budget_categories SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  const updated = db.prepare('SELECT id, wedding_id as weddingId, name, allocated, spent, notes, is_paid as isPaid FROM budget_categories WHERE id = ?').get(req.params.id);
  res.json({ ...updated, isPaid: !!updated.isPaid });
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT c.id FROM budget_categories c JOIN weddings w ON c.wedding_id = w.id WHERE c.id = ? AND w.user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Category not found' });
  db.prepare('DELETE FROM budget_categories WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
