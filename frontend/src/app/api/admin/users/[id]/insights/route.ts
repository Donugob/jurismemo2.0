import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

const gradePoints: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, E: 1, F: 0 };

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = Number(id)
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        level: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const grades = await prisma.grade.findMany({ 
      where: { user_id: userId },
      include: { course: true }
    })
    
    let totalPoints = 0;
    let totalUnits = 0;
    
    grades.forEach(g => {
      const units = g.course?.credit_units || 3;
      const points = gradePoints[g.grade] || 0;
      totalPoints += points * units;
      totalUnits += units;
    });
    
    const cgpa = totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00";

    const tasks = await prisma.task.findMany({ where: { user_id: userId } })

    return NextResponse.json({ user, cgpa, grades, tasks })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
