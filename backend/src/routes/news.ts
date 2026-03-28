import express from 'express';
import { prisma } from '../db';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;
