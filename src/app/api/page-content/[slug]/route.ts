/**
 * GET /api/page-content/:slug  → ดึงเนื้อหา (public)
 * PUT /api/page-content/:slug  → อัพเดท (admin)
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import PageContent from '@/lib/models/PageContent'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()
    const page = await PageContent.findOne({ slug: params.slug })
    return NextResponse.json({ success: true, content: page?.content ?? null, found: !!page })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    await dbConnect()
    const body = await request.json()
    const page = await PageContent.findOneAndUpdate(
      { slug: params.slug },
      { $set: { content: body.content, title: body.title } },
      { upsert: true, new: true }
    )
    return NextResponse.json({ success: true, page })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
