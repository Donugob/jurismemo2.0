import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [totalUsers, totalResources, totalNews] = await Promise.all([
      prisma.user.count(),
      prisma.resource.count(),
      prisma.news.count()
    ])

    return NextResponse.json({ totalUsers, totalResources, totalNews })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
