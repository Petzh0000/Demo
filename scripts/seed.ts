/**
 * 📁 scripts/seed.ts
 * -------------------------------------------------------
 * Script สำหรับ Seed ข้อมูลเริ่มต้นเข้า MongoDB
 *
 * 📌 วิธีรัน:
 *   npx ts-node --project tsconfig.seed.json scripts/seed.ts
 *
 *   หรือ (ถ้าใช้ tsx):
 *   npx tsx scripts/seed.ts
 *
 * 📌 ข้อควรระวัง:
 *   Script นี้จะ CLEAR สินค้าทั้งหมดใน collection แล้ว insert ใหม่
 *   ใช้สำหรับ initial setup เท่านั้น
 *
 * 📌 วิธีเพิ่มสินค้าใน seed:
 *   เพิ่ม object ใน SEED_PRODUCTS array
 * -------------------------------------------------------
 */

import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import * as path from 'path'

// โหลด .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) {
  console.error('❌ ไม่พบ MONGODB_URI ใน .env.local')
  process.exit(1)
}

// ─── Schema (copy จาก models/Product.ts) ───
const productSchema = new mongoose.Schema({
  name: String,
  nameEn: String,
  description: String,
  price: Number,
  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  category: { type: String, enum: ['massage', 'inhale', 'gift'], default: 'massage' },
  badge: { type: String, default: '' },
  tag: { type: String, default: '' },
  inStock: { type: Boolean, default: true },
  isVisible: { type: Boolean, default: true },
}, { timestamps: true })

const Product = mongoose.models.Product || mongoose.model('Product', productSchema)

// ─── ข้อมูล Seed ───
// 📌 แก้ imageUrl เป็น URL จาก Cloudinary ได้ในภายหลัง
// 📌 หรือปล่อยเป็น '' แล้วอัพโหลดผ่าน Admin Panel
const SEED_PRODUCTS = [
  {
    name: 'ยาหม่องผสมเสลดพังพอน สูตร 2',
    nameEn: 'Herbal Balm with Plumbago Formula 2',
    description: 'สูตรเข้มข้น บรรเทาปวดเมื่อยกล้ามเนื้อ คลายเส้น เหมาะสำหรับหมอนวดและผู้ที่ต้องการบรรเทาอาการปวด',
    price: 89,
    imageUrl: '',
    category: 'massage',
    badge: 'bestseller',
    tag: 'สูตร 2',
    inStock: true,
    isVisible: true,
  },
  {
    name: 'ยาหม่องผสมไพล สูตร 2',
    nameEn: 'Herbal Balm with Plai Formula 2',
    description: 'อุ่นสบาย บรรเทาอาการเคล็ด ช้ำ บวม เหมาะสำหรับนักกีฬาและผู้ที่ออกกำลังกาย',
    price: 89,
    imageUrl: '',
    category: 'massage',
    badge: 'popular',
    tag: 'สูตร 2',
    inStock: true,
    isVisible: true,
  },
  {
    name: 'ยาหม่องสูตรผสมพิมเสน',
    nameEn: 'Borneol Herbal Balm',
    description: 'เย็นหอม สูดดมแก้วิงเวียน คัดจมูก คลายความเครียด ให้ความสดชื่น',
    price: 79,
    imageUrl: '',
    category: 'inhale',
    badge: '',
    tag: 'สูตร 3',
    inStock: true,
    isVisible: true,
  },
  {
    name: 'ยาหม่องสีขาว',
    nameEn: 'White Herbal Balm',
    description: 'ใช้ทาผิวหนัง บรรเทาอาการคันจากแมลงกัดต่อย ผดผื่น เย็นสบาย',
    price: 79,
    imageUrl: '',
    category: 'massage',
    badge: '',
    tag: 'สูตร 4',
    inStock: true,
    isVisible: true,
  },
  {
    name: 'น้ำมันนวดผสมไพล สูตรร้อน',
    nameEn: 'Hot Massage Oil with Plai',
    description: 'ร้อนลึก คลายกล้ามเนื้อที่เมื่อยล้า เหมาะสำหรับนักกีฬาและผู้ที่ต้องการการฟื้นฟู',
    price: 149,
    imageUrl: '',
    category: 'massage',
    badge: 'new',
    tag: 'สูตรพิเศษ',
    inStock: true,
    isVisible: true,
  },
  {
    name: 'เซ็ตของขวัญสมุนไพรไทย',
    nameEn: 'Thai Herb Gift Set',
    description: 'เซ็ตของขวัญสวยงาม บรรจุยาหม่องหลากสูตร เหมาะเป็นของฝากและของชำร่วย',
    price: 299,
    imageUrl: '',
    category: 'gift',
    badge: 'premium',
    tag: 'Gift Set',
    inStock: true,
    isVisible: true,
  },
]

async function seed() {
  console.log('🔌 กำลังเชื่อมต่อ MongoDB...')
  await mongoose.connect(MONGODB_URI, { dbName: 'herb_store' })
  console.log('✅ เชื่อมต่อสำเร็จ')

  // Clear existing products
  const deletedCount = await Product.deleteMany({})
  console.log(`🗑️  ลบสินค้าเดิม ${deletedCount.deletedCount} รายการ`)

  // Insert seed data
  const inserted = await Product.insertMany(SEED_PRODUCTS)
  console.log(`✅ เพิ่มสินค้า ${inserted.length} รายการ`)

  inserted.forEach((p: any, i: number) => {
    console.log(`   ${i + 1}. ${p.name} (${p._id})`)
  })

  await mongoose.disconnect()
  console.log('\n🎉 Seed เสร็จสมบูรณ์! รัน npm run dev แล้วไปที่ /admin/products')
}

seed().catch(err => {
  console.error('❌ Seed ล้มเหลว:', err)
  process.exit(1)
})
