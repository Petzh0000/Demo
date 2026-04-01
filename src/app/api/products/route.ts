/**
 * 📁 src/app/api/products/route.ts
 * -------------------------------------------------------
 * API Route สำหรับ Products Collection
 *
 * GET  /api/products          → ดึงสินค้าทั้งหมด
 * GET  /api/products?category=massage → ดึงตามหมวดหมู่
 * POST /api/products          → เพิ่มสินค้าใหม่ (Admin)
 *
 * 📌 วิธีทดสอบ:
 *   curl http://localhost:3000/api/products
 *   curl http://localhost:3000/api/products?category=massage
 * -------------------------------------------------------
 */

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Product from '@/lib/models/Product'

// ─────────────────────────────────────────
// GET — ดึงสินค้าทั้งหมด (หรือกรองด้วย query)
// ─────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')  // ?category=massage
    const adminMode = searchParams.get('admin')    // ?admin=1 สำหรับ admin ดูหมด

    // สร้าง filter object
    const filter: Record<string, any> = {}

    // ถ้าไม่ใช่ admin mode → แสดงเฉพาะสินค้าที่ isVisible = true
    if (!adminMode) {
      filter.isVisible = true
    }

    // กรองตาม category ถ้ามี
    if (category && category !== 'all') {
      filter.category = category
    }

    // ดึงข้อมูลจาก MongoDB เรียงตามวันที่สร้าง (ใหม่สุดก่อน)
    const products = await Product.find(filter).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    })
  } catch (error: any) {
    console.error('GET /api/products error:', error)
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────
// POST — เพิ่มสินค้าใหม่ (Admin เท่านั้น)
// ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ Admin Secret Header
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    await dbConnect()

    const body = await request.json()

    // สร้างสินค้าใหม่ใน MongoDB
    const product = await Product.create(body)

    return NextResponse.json(
      { success: true, product },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST /api/products error:', error)

    // Mongoose validation error → ส่ง error message ที่อ่านได้
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
