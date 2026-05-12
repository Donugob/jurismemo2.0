import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = Number(params.id)
    const grades = await prisma.grade.findMany({ where: { user_id: userId } })
    const tasks = await prisma.task.findMany({ where: { user_id: userId } })

    return NextResponse.json({ grades, tasks })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
