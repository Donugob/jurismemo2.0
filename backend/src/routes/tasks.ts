import express from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { user_id: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { task, due_date } = req.body;
    const newTask = await prisma.task.create({
      data: {
        task,
        due_date,
        user_id: req.user!.id,
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

router.patch('/:id/toggle', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findFirst({
      where: { id: Number(id), user_id: req.user!.id }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        status: task.status === 'completed' ? 'pending' : 'completed'
      }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    await prisma.task.deleteMany({
      where: {
        id: Number(id),
        user_id: req.user!.id,
      },
    });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
