/**
 * 📁 src/app/api/products/[id]/route.ts
 * -------------------------------------------------------
 * API Route สำหรับจัดการสินค้าแต่ละชิ้น
 *
 * GET    /api/products/:id  → ดูรายละเอียดสินค้า
 * PUT    /api/products/:id  → แก้ไขสินค้า (Admin)
 * DELETE /api/products/:id  → ลบสินค้า (Admin) + ลบรูปใน Cloudinary
 *
 * 📌 ตัวอย่าง:
 *   GET    /api/products/664abc123def456
 *   PUT    /api/products/664abc123def456  body: { price: 99 }
 *   DELETE /api/products/664abc123def456
 * -------------------------------------------------------
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/lib/models/Product'
import { deleteImage } from '@/lib/cloudinary'

// ─────────────────────────────────────────
// GET — ดูสินค้าชิ้นเดียว
// ─────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้า' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// PUT — แก้ไขสินค้า (Admin เท่านั้น)
// ─────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ตรวจสอบ Admin
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const body = await request.json()

    // findByIdAndUpdate: ค้นหาและอัพเดทในขั้นตอนเดียว
    // new: true → return ข้อมูลใหม่หลัง update
    // runValidators: true → ตรวจสอบ schema validation ด้วย
    const product = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้า' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json({ success: false, message: messages.join(', ') }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// ─────────────────────────────────────────
// DELETE — ลบสินค้า + ลบรูปจาก Cloudinary
// ─────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ตรวจสอบ Admin
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    // ค้นหาสินค้าก่อน เพื่อเอา imagePublicId ไปลบรูปจาก Cloudinary
    const product = await Product.findById(params.id)
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบสินค้า' },
        { status: 404 }
      )
    }

    // ลบรูปออกจาก Cloudinary ก่อน (ถ้ามี publicId)
    if (product.imagePublicId) {
      await deleteImage(product.imagePublicId)
    }

    // ลบข้อมูลสินค้าออกจาก MongoDB
    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({
      success: true,
      message: 'ลบสินค้าเรียบร้อยแล้ว',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
