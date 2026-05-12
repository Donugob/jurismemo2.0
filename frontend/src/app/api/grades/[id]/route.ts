import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.grade.deleteMany({
      where: { id: Number(params.id), user_id: Number(session.user.id) }
    })

    return NextResponse.json({ message: 'Grade deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete grade' }, { status: 500 })
  }
}
