import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const take = Number(searchParams.get('take')) || 50
    const skip = Number(searchParams.get('skip')) || 0

    const news = await prisma.news.findMany({
      take,
      skip,
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(news)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
