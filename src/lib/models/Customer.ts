/**
 * 📁 src/lib/models/Customer.ts
 * -------------------------------------------------------
 * เก็บที่อยู่ลูกค้าโดยใช้เบอร์โทรเป็น key
 *
 * 📌 เมื่อลูกค้าติ๊ก "บันทึกที่อยู่ด้วยเบอร์โทร"
 *   → ข้อมูลถูกบันทึก/อัพเดทใน collection นี้
 *   → ครั้งต่อไปกรอกเบอร์โทร → ดึงที่อยู่เดิมมาใส่อัตโนมัติ
 * -------------------------------------------------------
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICustomerAddress extends Document {
  phone: string       // key หลัก
  name: string
  address: string
  district: string
  province: string
  postalCode: string
  updatedAt: Date
}

const customerAddressSchema = new Schema<ICustomerAddress>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { timestamps: true }
)

const CustomerAddress: Model<ICustomerAddress> =
  mongoose.models.CustomerAddress ||
  mongoose.model<ICustomerAddress>('CustomerAddress', customerAddressSchema)

export default CustomerAddress
