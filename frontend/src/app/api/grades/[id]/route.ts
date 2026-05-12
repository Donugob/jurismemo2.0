import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.grade.deleteMany({
      where: { id: Number(id), user_id: Number(session.user.id) }
    })

    return NextResponse.json({ message: 'Grade deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete grade' }, { status: 500 })
  }
}
