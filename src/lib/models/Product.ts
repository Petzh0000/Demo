/**
 * 📁 src/lib/models/Product.ts
 * -------------------------------------------------------
 * Mongoose Model สำหรับสินค้า (Products)
 *
 * 📌 ฟิลด์ทั้งหมด:
 *   - name        : ชื่อสินค้า (ภาษาไทย)
 *   - nameEn      : ชื่อสินค้า (ภาษาอังกฤษ) - optional
 *   - description : รายละเอียดสินค้า
 *   - price       : ราคา (บาท)
 *   - imageUrl    : URL รูปจาก Cloudinary
 *   - imagePublicId: Cloudinary public_id สำหรับลบรูป
 *   - category    : หมวดหมู่ (massage/inhale/gift)
 *   - badge       : ป้ายกำกับ (bestseller/popular/new/premium)
 *   - tag         : ป้ายสูตร เช่น "สูตร 1"
 *   - inStock     : มีสินค้าในสต็อกหรือไม่
 *   - isVisible   : แสดงสินค้าบนหน้าเว็บหรือไม่
 *   - createdAt   : วันที่สร้าง (auto)
 *   - updatedAt   : วันที่แก้ไขล่าสุด (auto)
 *
 * 📌 วิธีเพิ่มฟิลด์ใหม่:
 *   1. เพิ่มใน productSchema
 *   2. เพิ่มใน IProduct interface
 *   3. อัพเดต Admin form ใน /app/admin/products/
 * -------------------------------------------------------
 */

import mongoose, { Schema, Document, Model } from 'mongoose'

// TypeScript Interface — ใช้สำหรับ type checking
export interface IProduct extends Document {
  name: string
  nameEn?: string
  description: string
  price: number
  imageUrl: string         // URL รูปจาก Cloudinary
  imagePublicId?: string   // สำหรับลบรูปออกจาก Cloudinary
  category: 'massage' | 'inhale' | 'gift'
  badge?: 'bestseller' | 'popular' | 'new' | 'premium' | ''
  tag?: string
  inStock: boolean
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'กรุณากรอกชื่อสินค้า'],
      trim: true,       // ตัด space หัว-ท้ายออกอัตโนมัติ
      maxlength: [200, 'ชื่อสินค้าต้องไม่เกิน 200 ตัวอักษร'],
    },
    nameEn: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'กรุณากรอกรายละเอียดสินค้า'],
      trim: true,
      maxlength: [2000, 'รายละเอียดต้องไม่เกิน 2000 ตัวอักษร'],
    },
    price: {
      type: Number,
      required: [true, 'กรุณากรอกราคาสินค้า'],
      min: [0, 'ราคาต้องไม่ติดลบ'],
    },
    imageUrl: {
      type: String,
      required: [true, 'กรุณาอัพโหลดรูปสินค้า'],
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
      // เก็บไว้เพื่อใช้ตอนลบรูปออกจาก Cloudinary
    },
    category: {
      type: String,
      enum: {
        values: ['massage', 'inhale', 'gift'],
        message: 'หมวดหมู่ไม่ถูกต้อง',
      },
      required: [true, 'กรุณาเลือกหมวดหมู่'],
      default: 'massage',
    },
    badge: {
      type: String,
      enum: ['bestseller', 'popular', 'new', 'premium', ''],
      default: '',
    },
    tag: {
      type: String,
      trim: true,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,   // มีสต็อกเป็น default
    },
    isVisible: {
      type: Boolean,
      default: true,   // แสดงสินค้าเป็น default
    },
  },
  {
    timestamps: true,   // auto สร้าง createdAt และ updatedAt
  }
)

// ป้องกัน duplicate model ใน Next.js hot reload
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)

export default Product
