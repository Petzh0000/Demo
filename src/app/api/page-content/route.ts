/**
 * GET  /api/page-content          → ดึงทุก slug (admin)
 * POST /api/page-content          → สร้าง/อัพเดทเนื้อหา (admin)
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PageContent from '@/lib/models/PageContent'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    await dbConnect()
    const pages = await PageContent.find({}).sort({ slug: 1 })
    return NextResponse.json({ success: true, pages })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    await dbConnect()
    const { slug, title, content } = await request.json()
    const page = await PageContent.findOneAndUpdate(
      { slug },
      { slug, title, content },
      { upsert: true, new: true }
    )
    return NextResponse.json({ success: true, page })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
