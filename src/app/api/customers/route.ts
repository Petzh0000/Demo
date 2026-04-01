/**
 * 📁 src/app/api/customers/route.ts
 *
 * GET /api/customers?phone=0812345678
 * → คืน { found: true, customer: {...} } ถ้าเคย save ที่อยู่ไว้
 * → คืน { found: false }                 ถ้าไม่เคย
 *
 * ใช้ตอนลูกค้ากรอกเบอร์โทรในหน้า Checkout
 * → auto-fill ที่อยู่ให้ทันที
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import CustomerAddress from '@/lib/models/Customer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')?.trim()

    if (!phone || phone.length < 9) {
      return NextResponse.json({ found: false })
    }

    await dbConnect()
    const customer = await CustomerAddress.findOne({ phone })

    if (!customer) return NextResponse.json({ found: false })

    return NextResponse.json({
      found: true,
      customer: {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        district: customer.district,
        province: customer.province,
        postalCode: customer.postalCode,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 })
  }
}
