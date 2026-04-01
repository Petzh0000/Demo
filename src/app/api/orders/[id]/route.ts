/**
 * 📁 src/app/api/orders/[id]/route.ts
 *
 * GET  /api/orders/:id              → ดูออเดอร์ (ลูกค้า/Admin)
 * PUT  /api/orders/:id              → อัพเดทสถานะ (Admin) หรือ upload slip (ลูกค้า)
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import { uploadImage } from '@/lib/cloudinary'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    // หาด้วย _id หรือ orderNumber
    const order = await Order.findOne({
      $or: [{ _id: params.id.length === 24 ? params.id : null }, { orderNumber: params.id }],
    })

    if (!order) return NextResponse.json({ success: false, message: 'ไม่พบออเดอร์' }, { status: 404 })
    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const contentType = request.headers.get('content-type') || ''

    // ─── ลูกค้า upload สลิป (multipart/form-data) ───
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('slip') as File | null
      const orderId = formData.get('orderId') as string

      if (!file) return NextResponse.json({ success: false, message: 'ไม่พบไฟล์สลิป' }, { status: 400 })

      const { url } = await uploadImage(file)

      const order = await Order.findByIdAndUpdate(
        orderId || params.id,
        { slipUrl: url, paymentStatus: 'paid' },
        { new: true }
      )
      return NextResponse.json({ success: true, order })
    }

    // ─── Admin อัพเดทสถานะ (JSON) ───
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const order = await Order.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    if (!order) return NextResponse.json({ success: false, message: 'ไม่พบออเดอร์' }, { status: 404 })
    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
