/**
 * 📁 src/app/api/upload/route.ts
 * -------------------------------------------------------
 * API Route สำหรับ Upload รูปภาพไป Cloudinary
 *
 * POST /api/upload   → รับ FormData (field: "image") → อัพขึ้น Cloudinary
 *
 * 📌 Response:
 *   { url: "https://res.cloudinary.com/...", publicId: "herb-store/products/..." }
 *
 * 📌 ข้อจำกัด:
 *   - รองรับเฉพาะ image/* (jpg, png, webp, gif)
 *   - ขนาดสูงสุด 10MB
 *   - Admin เท่านั้น (ตรวจสอบ x-admin-secret header)
 *
 * 📌 ถ้าอยากเพิ่ม folder อื่น:
 *   แก้ folder ใน cloudinary.ts → uploadImage()
 * -------------------------------------------------------
 */

import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ Admin
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    // รับ FormData
    const formData = await request.formData()
    const file = formData.get('image') as File | null

    // ตรวจสอบว่ามีไฟล์
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'กรุณาเลือกรูปภาพ' },
        { status: 400 }
      )
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'รองรับเฉพาะไฟล์รูปภาพเท่านั้น (jpg, png, webp)' },
        { status: 400 }
      )
    }

    // ตรวจสอบขนาดไฟล์ (สูงสุด 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'ขนาดไฟล์ต้องไม่เกิน 10MB' },
        { status: 400 }
      )
    }

    // อัพโหลดไป Cloudinary
    const { url, publicId } = await uploadImage(file)

    return NextResponse.json({
      success: true,
      url,
      publicId,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'อัพโหลดรูปไม่สำเร็จ: ' + error.message },
      { status: 500 }
    )
  }
}

// ขยาย limit สำหรับ upload
export const config = {
  api: { bodyParser: false },
}
