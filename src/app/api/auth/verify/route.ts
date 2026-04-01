/**
 * 📁 src/app/api/auth/verify/route.ts
 * -------------------------------------------------------
 * ตรวจสอบรหัสผ่าน Admin
 *
 * POST /api/auth/verify  body: { secret: "..." }
 * → 200 { success: true }  ถ้ารหัสถูก
 * → 401 { success: false } ถ้ารหัสผิด
 *
 * 📌 รหัสผ่านตั้งค่าได้ที่ .env.local → ADMIN_SECRET
 * -------------------------------------------------------
 */
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()

    if (!secret) {
      return NextResponse.json({ success: false, message: 'กรุณาใส่รหัสผ่าน' }, { status: 400 })
    }

    // เทียบกับ ADMIN_SECRET ใน .env.local
    if (secret !== process.env.ADMIN_SECRET) {
      // หน่วงเวลา 500ms ป้องกัน brute-force
      await new Promise(r => setTimeout(r, 500))
      return NextResponse.json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, message: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
