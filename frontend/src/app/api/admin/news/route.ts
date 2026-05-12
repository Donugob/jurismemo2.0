import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, content, category, level } = await req.json()
    const news = await prisma.news.create({
      data: { title, content, category, level: level || 'All' }
    })
    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
