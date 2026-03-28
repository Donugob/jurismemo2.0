import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const resourceType = req.body.resource_type || 'general';
    const subfolder = resourceType.toLowerCase().replace(/ /g, '_');
    const dir = path.join(__dirname, '../../resources', subfolder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'resource_' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// List resources
router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { resource_type, level } = req.query;
    const whereClause: any = {};
    if (resource_type) whereClause.resource_type = resource_type.toString();
    if (level) whereClause.level = level.toString();

    const resources = await prisma.resource.findMany({
      where: whereClause,
      orderBy: { upload_date: 'desc' },
      include: {
        uploader: { select: { username: true } }
      }
    });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Upload resource (Admin only)
router.post('/', authenticateToken, upload.single('file'), async (req: AuthRequest, res: express.Response) => {
  try {
    if (req.user!.username !== 'Donugob') {
      return res.status(403).json({ error: 'Admin only access' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, resource_type, level } = req.body;
    
    // Relative path for database
    const subfolder = resource_type.toLowerCase().replace(/ /g, '_');
    const relativePath = `resources/${subfolder}/${req.file.filename}`;

    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        resource_type,
        level,
        file_path: relativePath,
        uploaded_by: req.user!.id
      }
    });

    res.status(201).json(newResource);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add resource' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    if (req.user!.username !== 'Donugob') {
      return res.status(403).json({ error: 'Admin only access' });
    }

    const resourceId = Number(req.params.id);
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    
    if (!resource) return res.status(404).json({ error: 'Resource not found' });

    await prisma.resource.delete({ where: { id: resourceId } });
    
    const filePath = path.join(__dirname, '../..', resource.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

export default router;
