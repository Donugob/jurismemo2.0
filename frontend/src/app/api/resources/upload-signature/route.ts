import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
})

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const timestamp = Math.round(new Date().getTime() / 1000)
    
    // Cloudinary config will auto-parse the URL to get api_secret and cloud_name
    const apiSecret = cloudinary.config().api_secret
    if (!apiSecret) {
        throw new Error('Cloudinary secret not found')
    }

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: 'jurismemo_resources',
      },
      apiSecret
    )

    return NextResponse.json({
      timestamp,
      signature,
      cloudName: cloudinary.config().cloud_name,
      apiKey: cloudinary.config().api_key
    })
  } catch (error) {
    console.error('Signature error:', error)
    return NextResponse.json({ error: 'Failed to generate upload signature' }, { status: 500 })
  }
}
