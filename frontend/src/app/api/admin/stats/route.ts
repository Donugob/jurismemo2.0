import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

import { unstable_cache } from 'next/cache'

const getStats = unstable_cache(
  async () => {
    const [totalUsers, totalResources, totalNews] = await Promise.all([
      prisma.user.count(),
      prisma.resource.count(),
      prisma.news.count()
    ])
    return { totalUsers, totalResources, totalNews }
  },
  ['admin-stats'],
  { revalidate: 60 }
)

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { totalUsers, totalResources, totalNews } = await getStats()

    return NextResponse.json({ totalUsers, totalResources, totalNews })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
