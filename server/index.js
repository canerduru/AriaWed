import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import weddingRoutes from './routes/weddings.js';
import guestRoutes from './routes/guests.js';
import budgetRoutes from './routes/budget.js';
import taskRoutes from './routes/tasks.js';
import websiteRoutes from './routes/website.js';
import ariaRoutes from './routes/aria.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/weddings', weddingRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/website', websiteRoutes);
app.use('/api/aria', ariaRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`AriaWed API running at http://localhost:${PORT}`);
});
