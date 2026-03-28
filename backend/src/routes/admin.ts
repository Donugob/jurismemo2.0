import express from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Cloudinary configuration
if (process.env.CLOUDINARY_URL) {
  const url = process.env.CLOUDINARY_URL;
  const authPart = url.replace('cloudinary://', '').split('@')[0];
  const [apiKey, apiSecret] = authPart.split(':');
  const cloudName = url.split('@')[1];

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
  console.log('Cloudinary Configured for Admin Uploads (Explicit Parts)');
} else {
  console.warn('Warning: CLOUDINARY_URL not found in environment');
}

// Strict Admin Middleware
const isAdmin = (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  if (req.user && req.user.id === 1) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Administrator only.' });
  }
};

// Get all users
router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        level: true,
        firstName: true,
        lastName: true,
        createdAt: true
      },
      orderBy: { id: 'asc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user insights (grades, tasks, etc.)
router.get('/users/:id/insights', authenticateToken, isAdmin, async (req, res) => {
  const userId = parseInt(String(req.params.id));
  try {
    const userInsights = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        grades: {
          include: { course: true }
        },
        tasks: true
      }
    });

    if (!userInsights) return res.status(404).json({ error: 'User not found' });

    // Calculate GPA/CGPA for this user
    let totalPoints = 0;
    let totalUnits = 0;
    const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

    userInsights.grades.forEach((g: any) => {
      const units = g.course.credit_units;
      const points = gradePoints[g.grade] || 0;
      totalPoints += points * units;
      totalUnits += units;
    });

    const cgpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";

    res.json({
      user: {
        id: userInsights.id,
        username: userInsights.username,
        email: userInsights.email,
        level: userInsights.level,
        firstName: userInsights.firstName,
        lastName: userInsights.lastName
      },
      cgpa,
      grades: userInsights.grades,
      tasks: userInsights.tasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch insights' });
  }
});

// System Stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [userCount, resourceCount, gradeCount] = await Promise.all([
      prisma.user.count(),
      prisma.resource.count(),
      prisma.grade.count()
    ]);

    res.json({
      totalUsers: userCount,
      totalResources: resourceCount,
      totalGradesRecorded: gradeCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// News Management
router.post('/news', authenticateToken, isAdmin, async (req, res) => {
  const { title, content, category, level } = req.body;
  try {
    const news = await prisma.news.create({
      data: { title, content, category, level: level || 'All' }
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create news' });
  }
});

router.delete('/news/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.news.delete({ where: { id: parseInt(String(req.params.id)) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

// Resource Management
const uploadMiddleware = upload.single('file');

router.post('/resources/upload', authenticateToken, isAdmin, (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err);
      return res.status(400).json({ error: `File upload error: ${err.message}` });
    } else if (err) {
      console.error('Unknown Upload Error:', err);
      return res.status(500).json({ error: 'Internal server error during file processing' });
    }
    next();
  });
}, async (req: any, res) => {
  const authReq = req as AuthRequest;
  console.log('--- ADMIN UPLOAD INITIATED ---');
  console.log('Body:', req.body);
  console.log('File:', req.file ? { name: req.file.originalname, type: req.file.mimetype, size: req.file.size } : 'NONE');

  try {
    if (!req.file) {
      console.log('Error: No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, level, type } = req.body;

    // Upload to Cloudinary using buffer
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(req.file.mimetype);
    const resourceType = isImage ? "image" : "raw";

    console.log(`Uploading to Cloudinary as ${resourceType}...`);
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: resourceType,
      folder: "juris_resources",
    });

    console.log('Cloudinary Success:', uploadResult.secure_url);

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        level,
        resource_type: type,
        file_path: uploadResult.secure_url,
        uploaded_by: authReq.user!.id
      }
    });

    console.log('Database Success: Resource ID', resource.id);
    res.json(resource);
  } catch (error: any) {
    console.error('--- UPLOAD FAILED ---');
    console.error('Error Object:', JSON.stringify(error, null, 2));
    console.error('Error Message:', error.message);
    if (error.stack) console.error(error.stack);
    
    let errorMessage = 'Upload failed';
    if (error.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = JSON.stringify(error);
    }
    
    if (error.http_code) errorMessage += ` (Cloudinary error ${error.http_code})`;
    
    res.status(500).json({ error: errorMessage });
  }
});

router.delete('/resources/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    await prisma.resource.delete({ where: { id: parseInt(String(req.params.id)) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
