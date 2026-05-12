import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level')
    const semester = searchParams.get('semester')

    if (!level || !semester) return NextResponse.json({ error: 'Level and semester required' }, { status: 400 })

    const courses = await prisma.course.findMany({
      where: {
        level: level,
        semester: semester
      }
    })
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
