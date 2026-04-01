/**
 * 📁 src/lib/models/Order.ts
 * -------------------------------------------------------
 * Mongoose Model สำหรับ Orders (คำสั่งซื้อ)
 *
 * 📌 โครงสร้างข้อมูล:
 *   - orderNumber   : เลขที่ออเดอร์ (auto: ORD-YYYYMMDD-XXXX)
 *   - items         : รายการสินค้า (productId, name, price, qty, imageUrl)
 *   - customer      : ข้อมูลลูกค้า (ชื่อ, เบอร์, ที่อยู่)
 *   - paymentMethod : "qr" | "cod"
 *   - paymentStatus : "pending" | "paid" | "cancelled"
 *   - orderStatus   : "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
 *   - totalAmount   : ยอดรวม (บาท)
 *   - shippingFee   : ค่าจัดส่ง
 *   - note          : หมายเหตุจากลูกค้า
 *   - slipUrl       : URL รูปสลิปโอนเงิน (สำหรับ QR)
 *
 * 📌 วิธีเพิ่มฟิลด์ใหม่:
 *   1. เพิ่มใน orderSchema
 *   2. เพิ่มใน IOrder interface
 *   3. อัพเดท checkout form
 * -------------------------------------------------------
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOrderItem {
  productId: string
  name: string
  nameEn?: string
  price: number
  quantity: number
  imageUrl: string
}

export interface ICustomer {
  name: string
  phone: string
  address: string
  district: string
  province: string
  postalCode: string
  savedAddress: boolean  // ลูกค้าเลือก save ที่อยู่ไว้ไหม
}

export interface IOrder extends Document {
  orderNumber: string
  items: IOrderItem[]
  customer: ICustomer
  paymentMethod: 'qr' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'cancelled'
  orderStatus: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
  totalAmount: number
  shippingFee: number
  note?: string
  slipUrl?: string
  createdAt: Date
  updatedAt: Date
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  nameEn: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, default: '' },
})

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: [true, 'กรุณากรอกชื่อ'] },
  phone: { type: String, required: [true, 'กรุณากรอกเบอร์โทร'] },
  address: { type: String, required: [true, 'กรุณากรอกที่อยู่'] },
  district: { type: String, required: [true, 'กรุณากรอกอำเภอ/เขต'] },
  province: { type: String, required: [true, 'กรุณากรอกจังหวัด'] },
  postalCode: { type: String, required: [true, 'กรุณากรอกรหัสไปรษณีย์'] },
  savedAddress: { type: Boolean, default: false },
})

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () => {
        const date = new Date()
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
        return `ORD-${y}${m}${d}-${rand}`
      },
    },
    items: { type: [orderItemSchema], required: true, validate: [(v: any[]) => v.length > 0, 'ต้องมีสินค้าอย่างน้อย 1 ชิ้น'] },
    customer: { type: customerSchema, required: true },
    paymentMethod: {
      type: String,
      enum: { values: ['qr', 'cod'], message: 'วิธีชำระเงินไม่ถูกต้อง' },
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
      default: 'pending',
    },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 50 },
    note: { type: String, default: '' },
    slipUrl: { type: String, default: '' },
  },
  { timestamps: true }
)

// Index สำหรับ query เร็วขึ้น
orderSchema.index({ 'customer.phone': 1 })
orderSchema.index({ orderStatus: 1 })
orderSchema.index({ createdAt: -1 })

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)

export default Order
