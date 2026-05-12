import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
})

export async function GET(req: Request) {
  try {
    const resources = await prisma.resource.findMany({
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

    const formData = await req.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const resource_type = formData.get('resource_type') as string
    const level = formData.get('level') as string

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const buffer = await file.arrayBuffer()
    const base64Data = Buffer.from(buffer).toString('base64')
    const fileUri = `data:${file.type};base64,${base64Data}`

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'jurismemo_resources',
      resource_type: 'auto'
    })

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        file_path: uploadResponse.secure_url,
        resource_type,
        level,
        uploaded_by: Number(session.user.id)
      }
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to upload resource' }, { status: 500 })
  }
}
