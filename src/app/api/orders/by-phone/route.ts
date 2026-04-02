/**
 * GET /api/orders/by-phone?phone=0812345678
 * คืนออเดอร์ทั้งหมดของเบอร์นี้ (ให้ client กรองเอง)
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Order from '@/lib/models/Order'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const phone = new URL(request.url).searchParams.get('phone')?.trim()
    if (!phone || phone.length < 9)
      return NextResponse.json({ orders: [] })

    await dbConnect()
    const orders = await Order.find({ 'customer.phone': phone }).sort({ createdAt: -1 }).limit(20)
    return NextResponse.json({ success: true, orders })
  } catch (e: any) {
    return NextResponse.json({ success: false, orders: [], message: e.message }, { status: 500 })
  }
}
