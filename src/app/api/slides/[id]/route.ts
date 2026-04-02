/**
 * PUT    /api/slides/:id  → แก้ไข (order, isVisible)
 * DELETE /api/slides/:id  → ลบ + ลบรูปจาก Cloudinary
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Slide from '@/lib/models/Slide'
import { deleteImage } from '@/lib/cloudinary'

function auth(req: NextRequest) {
  return req.headers.get('x-admin-secret') === process.env.ADMIN_SECRET
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    await dbConnect()
    const body = await req.json()
    const slide = await Slide.findByIdAndUpdate(params.id, body, { new: true })
    if (!slide) return NextResponse.json({ success: false, message: 'ไม่พบ slide' }, { status: 404 })
    return NextResponse.json({ success: true, slide })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  try {
    await dbConnect()
    const slide = await Slide.findById(params.id)
    if (!slide) return NextResponse.json({ success: false, message: 'ไม่พบ slide' }, { status: 404 })
    if (slide.imagePublicId) await deleteImage(slide.imagePublicId)
    await Slide.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
