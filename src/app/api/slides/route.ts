/**
 * GET  /api/slides       → ดึง slides ทั้งหมดที่ isVisible=true (หน้าเว็บ)
 * GET  /api/slides?admin=1 → ดึงทั้งหมด (admin)
 * POST /api/slides       → เพิ่ม slide ใหม่ (admin)
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Slide from '@/lib/models/Slide'
import { uploadImage } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const admin = new URL(request.url).searchParams.get('admin')
    const filter = admin ? {} : { isVisible: true }
    const slides = await Slide.find(filter).sort({ order: 1, createdAt: 1 })
    return NextResponse.json({ success: true, slides })
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
    const formData = await request.formData()
    const file = formData.get('image') as File | null
    const order = Number(formData.get('order') ?? 0)

    if (!file) return NextResponse.json({ success: false, message: 'กรุณาเลือกรูปภาพ' }, { status: 400 })

    const { url, publicId } = await uploadImage(file)
    const slide = await Slide.create({ imageUrl: url, imagePublicId: publicId, order })
    return NextResponse.json({ success: true, slide }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
