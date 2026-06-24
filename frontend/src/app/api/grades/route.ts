import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level')
    const semester = searchParams.get('semester')

    const whereClause: any = { user_id: Number(session.user.id) }
    if (level) whereClause.level = level
    if (semester) whereClause.semester = semester

    const grades = await prisma.grade.findMany({
      where: whereClause,
      include: { course: true }
    })

    return NextResponse.json(grades)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { course_code, grade, level, semester } = await req.json()
    
    await prisma.course.upsert({
      where: { 
        course_code_level_semester: { course_code, level, semester }
      },
      update: {},
      create: { course_code, title: `Course ${course_code}`, level, semester, credit_units: 3 }
    })

    const existingGrade = await prisma.grade.findFirst({
      where: { user_id: Number(session.user.id), course_code, level, semester }
    })

    let result;
    if (existingGrade) {
      result = await prisma.grade.update({
        where: { id: existingGrade.id },
        data: { grade }
      })
    } else {
      result = await prisma.grade.create({
        data: { user_id: Number(session.user.id), course_code, grade, level, semester }
      })
    }

    return NextResponse.json(result, { status: existingGrade ? 200 : 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add grade' }, { status: 500 })
  }
}
