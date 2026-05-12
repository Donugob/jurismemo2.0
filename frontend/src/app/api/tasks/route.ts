import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const tasks = await prisma.task.findMany({
      where: { user_id: Number(session.user.id) },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { task, due_date } = await req.json()
    const newTask = await prisma.task.create({
      data: {
        task,
        due_date,
        user_id: Number(session.user.id),
      },
    })
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 })
  }
}
