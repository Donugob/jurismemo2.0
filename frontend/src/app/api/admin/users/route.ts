import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const take = Number(searchParams.get('take')) || 100
    const skip = Number(searchParams.get('skip')) || 0

    const users = await prisma.user.findMany({
      take,
      skip,
      select: { id: true, username: true, email: true, level: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
