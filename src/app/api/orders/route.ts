/**
 * 📁 src/app/api/orders/route.ts
 *
 * GET  /api/orders              → Admin ดูออเดอร์ทั้งหมด
 * GET  /api/orders?status=...   → กรองตาม status
 * POST /api/orders              → ลูกค้าสร้างออเดอร์ + แจ้งเตือน Telegram
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/lib/models/Order'
import CustomerAddress from '@/lib/models/Customer'
import { sendTelegramNotify } from '@/lib/telegram'

// ─── GET — Admin ดูออเดอร์ทั้งหมด ───
export async function GET(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const payment = searchParams.get('payment')

    const filter: Record<string, any> = {}
    if (status) filter.orderStatus = status
    if (payment) filter.paymentStatus = payment

    const orders = await Order.find(filter).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, count: orders.length, orders })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

// ─── POST — ลูกค้าสร้างออเดอร์ใหม่ ───
export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    // 1. สร้างออเดอร์ใน MongoDB
    const order = await Order.create({
      items: body.items,
      customer: body.customer,
      paymentMethod: body.paymentMethod,
      totalAmount: body.totalAmount,
      shippingFee: body.shippingFee ?? 50,
      note: body.note ?? '',
    })

    // 2. บันทึกที่อยู่ถ้าลูกค้าติ๊ก checkbox
    if (body.customer.savedAddress) {
      await CustomerAddress.findOneAndUpdate(
        { phone: body.customer.phone },
        {
          phone: body.customer.phone,
          name: body.customer.name,
          address: body.customer.address,
          district: body.customer.district,
          province: body.customer.province,
          postalCode: body.customer.postalCode,
        },
        { upsert: true, new: true }
      )
    }

    // 3. ส่งแจ้งเตือน Telegram (ไม่ await — ไม่ให้ช้าถ้า Telegram หน่วง)
    sendTelegramNotify({
      orderNumber: order.orderNumber,
      customerName: body.customer.name,
      customerPhone: body.customer.phone,
      items: body.items.map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      address: `${body.customer.address} ${body.customer.district} ${body.customer.province} ${body.customer.postalCode}`,
    })

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json({ success: false, message: messages.join(', ') }, { status: 400 })
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
