import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const task = await prisma.task.findFirst({
      where: { id: Number(params.id), user_id: Number(session.user.id) }
    })

    if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

    const updatedTask = await prisma.task.update({
      where: { id: Number(params.id) },
      data: {
        status: task.status === 'completed' ? 'pending' : 'completed'
      }
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to toggle task' }, { status: 500 })
  }
}
