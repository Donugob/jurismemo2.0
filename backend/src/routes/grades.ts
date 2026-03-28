import express from 'express';
import { prisma } from '../db';
import { authenticateToken, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

router.get('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { level, semester } = req.query;
    const whereClause: any = { user_id: req.user!.id };
    
    if (level) whereClause.level = level.toString();
    if (semester) whereClause.semester = semester.toString();

    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: {
        course: true
      }
    });

    res.json(grades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

router.post('/', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { course_code, grade, level, semester } = req.body;
    
    let course = await prisma.course.findUnique({ 
      where: { 
        course_code_level_semester: {
          course_code,
          level,
          semester
        }
      } 
    });
    if (!course) {
      course = await prisma.course.create({
        data: {
          course_code,
          title: `Course ${course_code}`,
          level,
          semester,
          credit_units: 3
        }
      });
    }

    const existingGrade = await prisma.grade.findFirst({
      where: {
        user_id: req.user!.id,
        course_code,
        level,
        semester
      }
    });

    let result;
    if (existingGrade) {
      result = await prisma.grade.update({
        where: { id: existingGrade.id },
        data: { grade }
      });
    } else {
      result = await prisma.grade.create({
        data: {
          user_id: req.user!.id,
          course_code,
          grade,
          level,
          semester
        }
      });
    }

    res.status(existingGrade ? 200 : 201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add grade' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    await prisma.grade.deleteMany({
      where: { id: Number(req.params.id), user_id: req.user!.id }
    });
    res.json({ message: 'Grade deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete grade' });
  }
});

router.get('/gpa', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const grades = await prisma.grade.findMany({
      where: { user_id: req.user!.id },
      include: { course: true }
    });

    let totalPointsCgpa = 0;
    let totalUnitsCgpa = 0;

    let totalPointsGpa = 0;
    let totalUnitsGpa = 0;

    const { level, semester } = req.query;

    grades.forEach((g: any) => {
      const units = g.course.credit_units;
      const points = gradePoints[g.grade] || 0;
      
      totalPointsCgpa += points * units;
      totalUnitsCgpa += units;

      if (g.level === level && g.semester === semester) {
        totalPointsGpa += points * units;
        totalUnitsGpa += units;
      }
    });

    const cgpa = totalUnitsCgpa > 0 ? (totalPointsCgpa / totalUnitsCgpa).toFixed(2) : "0.00";
    const gpa = totalUnitsGpa > 0 ? (totalPointsGpa / totalUnitsGpa).toFixed(2) : "0.00";

    res.json({ cgpa, gpa });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calc GPA' });
  }
});

router.get('/available-courses', authenticateToken, async (req: AuthRequest, res: express.Response) => {
  try {
    const { level, semester } = req.query;
    if (!level || !semester) return res.status(400).json({ error: 'Level and semester required' });

    const courses = await prisma.course.findMany({
      where: {
        level: level.toString(),
        semester: semester.toString()
      }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

export default router;
