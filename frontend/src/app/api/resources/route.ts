import { NextResponse } from 'next/server'
export const revalidate = 60;
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const take = Number(searchParams.get('take')) || 50
    const skip = Number(searchParams.get('skip')) || 0

    const resources = await prisma.resource.findMany({
      take,
      skip,
      orderBy: { upload_date: 'desc' }
    })
    return NextResponse.json(resources)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, description, resource_type, level, file_path } = await req.json()

    if (!file_path || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        file_path,
        resource_type,
        level,
        uploaded_by: Number(session.user.id)
      }
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Resource create error:', error)
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 })
  }
}
