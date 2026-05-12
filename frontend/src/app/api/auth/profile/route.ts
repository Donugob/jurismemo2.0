import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/../auth'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) }
    })

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { password, ...userData } = user
    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { firstName, lastName, phoneNumber, address, level, preferredCourses } = await req.json()
    
    const updatedUser = await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { firstName, lastName, phoneNumber, address, level, preferredCourses }
    })

    const { password: _, ...userData } = updatedUser
    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
