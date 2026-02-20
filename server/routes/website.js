import { Router } from 'express';
import { db } from '../db/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

function canAccessWedding(userId, weddingId) {
  const w = db.prepare('SELECT id FROM weddings WHERE id = ? AND user_id = ?').get(weddingId, userId);
  return !!w;
}

// Public: get wedding website by id (no auth) for /w/:weddingId
router.get('/public/:weddingId', (req, res) => {
  const row = db.prepare('SELECT data FROM website WHERE wedding_id = ?').get(req.params.weddingId);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(JSON.parse(row.data));
});

router.use(authMiddleware);

router.get('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const row = db.prepare('SELECT data FROM website WHERE wedding_id = ?').get(req.params.weddingId);
  if (!row) return res.json(null);
  res.json(JSON.parse(row.data));
});

router.put('/wedding/:weddingId', (req, res) => {
  if (!canAccessWedding(req.user.id, req.params.weddingId)) {
    return res.status(404).json({ error: 'Wedding not found' });
  }
  const data = JSON.stringify(req.body);
  db.prepare(`
    INSERT INTO website (wedding_id, data) VALUES (?, ?)
    ON CONFLICT(wedding_id) DO UPDATE SET data = excluded.data
  `).run(req.params.weddingId, data);
  res.json(req.body);
});

export default router;
