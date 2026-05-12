import { handlers } from "@/auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<any> }) {
  await params
  return handlers.GET(req)
}

export async function POST(req: NextRequest, { params }: { params: Promise<any> }) {
  await params
  return handlers.POST(req)
}
