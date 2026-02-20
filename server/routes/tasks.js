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

function rowToTask(r) {
  return {
    id: r.id,
    weddingId: r.wedding_id,
    title: r.title,
    category: r.category,
    priority: r.priority,
    dueDate: r.due_date,
    assignedTo: r.assigned_to,
    status: r.status,
    description: r.description,
    completedAt: r.completed_at,
    isCustom: !!r.is_custom,
  };
}

router.get('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const rows = db.prepare('SELECT * FROM tasks WHERE wedding_id = ? ORDER BY due_date').all(req.params.weddingId);
  res.json(rows.map(rowToTask));
});

router.post('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const id = uuid();
  const t = req.body;
  db.prepare(`
    INSERT INTO tasks (id, wedding_id, title, category, priority, due_date, assigned_to, status, description, is_custom)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, req.params.weddingId, t.title, t.category || 'Other', t.priority || 'medium', t.dueDate || null, t.assignedTo || 'both',
    t.status || 'not_started', t.description || null, t.isCustom ? 1 : 0
  );
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.status(201).json(rowToTask(row));
});

router.patch('/:id', (req, res) => {
  const row = db.prepare('SELECT t.* FROM tasks t JOIN weddings w ON t.wedding_id = w.id WHERE t.id = ? AND w.user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Task not found' });
  const t = req.body;
  const updates = [];
  const values = [];
  const map = [
    ['title', t.title], ['category', t.category], ['priority', t.priority], ['due_date', t.dueDate], ['assigned_to', t.assignedTo],
    ['status', t.status], ['description', t.description], ['completed_at', t.completedAt],
  ];
  for (const [key, val] of map) {
    if (val !== undefined) {
      const col = key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
      updates.push(`${col} = ?`);
      values.push(val);
    }
  }
  if (updates.length) {
    values.push(req.params.id);
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(rowToTask(updated));
});

router.delete('/:id', (req, res) => {
  const row = db.prepare('SELECT t.id FROM tasks t JOIN weddings w ON t.wedding_id = w.id WHERE t.id = ? AND w.user_id = ?').get(req.params.id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
