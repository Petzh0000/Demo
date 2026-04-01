# 🌿 Thai Herb Brand — Next.js + MongoDB + Cloudinary

คู่มือฉบับสมบูรณ์สำหรับการดูแลและแก้ไขเว็บไซต์

---

## 📋 สารบัญ
1. [การติดตั้ง](#การติดตั้ง)
2. [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
3. [การตั้งค่า Cloudinary](#การตั้งค่า-cloudinary)
4. [Admin Panel — จัดการสินค้า](#admin-panel)
5. [วิธีแก้ไขแต่ละหน้า](#วิธีแก้ไขแต่ละหน้า)
6. [วิธีเปลี่ยนรูปภาพ](#วิธีเปลี่ยนรูปภาพ)
7. [วิธีแก้ไขสี/ฟอนต์](#วิธีแก้ไขสีและฟอนต์)
8. [การ Deploy](#การ-deploy)

---

## การติดตั้ง

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. แก้ไข .env.local (ใส่ Cloudinary credentials)
# ไฟล์อยู่ที่รากโปรเจค

# 3. (Optional) Seed ข้อมูลสินค้าตัวอย่าง
npm run seed

# 4. รัน dev server
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`
Admin Panel: `http://localhost:3000/admin`

---

## โครงสร้างโปรเจค

```
herb-website/
│
├── .env.local                  ← ⚙️ ตั้งค่า MongoDB, Cloudinary, Admin Password
│
├── src/
│   ├── app/                    ← 📄 หน้าต่างๆ (Next.js App Router)
│   │   ├── page.tsx            ← หน้าแรก
│   │   ├── about/page.tsx      ← เกี่ยวกับเรา
│   │   ├── shop/page.tsx       ← ร้านค้า (ดึงจาก MongoDB)
│   │   ├── news/page.tsx       ← ข่าวสาร
│   │   ├── contact/page.tsx    ← ติดต่อเรา
│   │   ├── vision/page.tsx     ← วิสัยทัศน์
│   │   ├── awards/page.tsx     ← รางวัล
│   │   │
│   │   ├── admin/              ← 🔐 Admin Panel
│   │   │   ├── page.tsx        ← หน้า Login
│   │   │   └── products/
│   │   │       ├── page.tsx    ← รายการสินค้าทั้งหมด
│   │   │       ├── new/        ← เพิ่มสินค้าใหม่
│   │   │       └── [id]/       ← แก้ไขสินค้า
│   │   │
│   │   └── api/                ← 🔌 API Routes
│   │       ├── products/       ← GET/POST สินค้า
│   │       │   └── [id]/       ← GET/PUT/DELETE สินค้าแต่ละชิ้น
│   │       └── upload/         ← POST อัพโหลดรูป → Cloudinary
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx      ← เมนูบนสุด
│   │   │   └── Footer.tsx      ← ส่วนล่างสุด
│   │   ├── sections/           ← Section ต่างๆ บนหน้าแรก
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ProductsSection.tsx ← ดึงข้อมูลจาก MongoDB
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── NewsSection.tsx
│   │   │   └── CTASection.tsx
│   │   └── admin/
│   │       └── ProductForm.tsx ← Form เพิ่ม/แก้ไขสินค้า
│   │
│   ├── lib/
│   │   ├── mongodb.ts          ← เชื่อมต่อ MongoDB Atlas
│   │   ├── cloudinary.ts       ← upload/delete รูปผ่าน Cloudinary
│   │   ├── models/
│   │   │   └── Product.ts      ← Mongoose Schema (โครงสร้างข้อมูลสินค้า)
│   │   └── data.ts             ← Mock data (Features, Testimonials)
│   │
│   └── styles/globals.css      ← CSS + Tailwind + Animations
│
├── scripts/
│   └── seed.ts                 ← Seed ข้อมูลตัวอย่าง
│
├── tailwind.config.js          ← สี, font, animation
└── next.config.js              ← image domains (Cloudinary)
```

---

## การตั้งค่า Cloudinary

### สมัครฟรี
1. ไปที่ [cloudinary.com](https://cloudinary.com) → Sign Up (ฟรี 25GB)
2. Login → ไปที่ **Dashboard**
3. Copy: **Cloud Name**, **API Key**, **API Secret**

### ใส่ค่าใน .env.local
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ชื่อ_cloud
CLOUDINARY_API_KEY=api_key_ของคุณ
CLOUDINARY_API_SECRET=api_secret_ของคุณ
```

> รูปจะเก็บที่ Cloudinary folder: `herb-store/products/`
> Auto-optimize → WebP, resize ≤ 800×800px

---

## Admin Panel

### วิธีเข้าใช้
```
URL: http://localhost:3000/admin
รหัสผ่าน: ค่า ADMIN_SECRET ใน .env.local (default: admin1234)
```

### วิธีเพิ่มสินค้าใหม่
1. `/admin/products` → คลิก **"เพิ่มสินค้า"**
2. กรอกข้อมูล: ชื่อ / รายละเอียด / ราคา / หมวดหมู่ / Badge
3. คลิกกล่องรูป → เลือกไฟล์ (jpg/png/webp ≤ 10MB) → Preview
4. คลิก **"เพิ่มสินค้า"** → รูปอัพ Cloudinary → ข้อมูลเข้า MongoDB

### วิธีแก้ไขสินค้า
1. คลิกปุ่ม ✏️ ที่รายการ → แก้ไขข้อมูล → **"บันทึก"**
2. เปลี่ยนรูป: คลิก ✕ → เลือกรูปใหม่ → **"บันทึก"**

### วิธีลบสินค้า
- คลิกปุ่ม 🗑️ → ยืนยัน → ลบข้อมูล + ลบรูปจาก Cloudinary อัตโนมัติ

### ซ่อน/แสดงสินค้าชั่วคราว
- คลิกปุ่ม **แสดง/ซ่อน** ในคอลัมน์ "แสดง" → สลับทันที (ไม่ต้องลบ)

---

## วิธีแก้ไขแต่ละหน้า

### 🏠 หน้าแรก — เปลี่ยน Section ที่แสดง
```tsx
// src/app/page.tsx
// ลบหรือ comment section ที่ไม่ต้องการ:
<HeroSection />
<AboutSection />
<ProductsSection />      ← ดึงข้อมูลจาก MongoDB
<TestimonialsSection />
<NewsSection />
<CTASection />
```

### 🌟 Hero Slider — เปลี่ยนข้อความและ Slide
```tsx
// src/components/sections/HeroSection.tsx
// ค้นหา SLIDES array:
const SLIDES = [
  {
    headline: 'ยาหม่องสมุนไพรไทย',   // ← หัวข้อหลัก
    subheadline: 'ที่คนทั่วโลกวางใจ', // ← หัวข้อรอง
    desc: 'คำอธิบาย...',              // ← เนื้อหา
    badge: 'อันดับ 1 ในไทย',          // ← ป้ายบน Hero
    emoji: '🌿',                       // ← ไอคอนกลาง
  },
  // เพิ่ม slide ได้ที่นี่
]
```

### 📰 ข่าวสาร — เพิ่ม/แก้ไขข่าว
```tsx
// src/app/news/page.tsx
// ค้นหา ALL_NEWS array:
const ALL_NEWS = [
  {
    title: 'ชื่อข่าว',         // ← หัวข้อข่าว
    excerpt: 'สรุปข่าว',       // ← เนื้อหาย่อ
    date: '15 มีนาคม 2567',   // ← วันที่
    category: 'ข่าวสาร',       // ← หมวด
    emoji: '📢',               // ← ไอคอน
    featured: true,            // ← true = ข่าวเด่น (แสดงใหญ่)
  },
]
```

### 📞 ติดต่อเรา — เปลี่ยนที่อยู่/เบอร์
```tsx
// src/app/contact/page.tsx
// ค้นหา contact items:
{ lines: ['ที่อยู่บรรทัด 1', 'บรรทัด 2'] }  // ← ที่อยู่
{ lines: ['034-318922', '085-700-5525'] }      // ← เบอร์โทร
href="mailto:อีเมล@ของคุณ.com"               // ← อีเมล
```

### 🏆 รางวัล — เพิ่ม/แก้ไขรางวัล
```tsx
// src/app/awards/page.tsx
const AWARDS = [
  { icon: '🏆', title: 'ชื่อรางวัล', year: '2566', org: 'หน่วยงาน', desc: 'รายละเอียด' },
]
```

### 💬 รีวิวลูกค้า — เปลี่ยน Testimonials
```tsx
// src/lib/data.ts
export const TESTIMONIALS = [
  { name: 'ชื่อลูกค้า', role: 'บทบาท', text: 'ข้อความรีวิว', rating: 5 },
]
```

---

## วิธีเปลี่ยนรูปภาพ

### รูปสินค้า (ทำผ่าน Admin Panel)
```
/admin/products → Edit → คลิก ✕ บนรูปเดิม → เลือกรูปใหม่ → บันทึก
รูปจะถูกอัพโหลดไป Cloudinary อัตโนมัติ
```

### รูป Logo (แก้ไขในโค้ด)
```tsx
// 1. วางไฟล์ที่: public/images/logo.png

// 2. แก้ src/components/layout/Navbar.tsx
// เปลี่ยนจาก: <Leaf className="text-white w-5 h-5" />
// เป็น:
import Image from 'next/image'
<Image src="/images/logo.png" alt="Logo" width={40} height={40} />
```

### รูป Background Hero
```tsx
// src/components/sections/HeroSection.tsx
// เพิ่ม backgroundImage ใน <section>:
style={{
  backgroundImage: 'url(/images/hero-bg.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}
// แล้วลบ gradient class ออก
```

---

## วิธีแก้ไขสีและฟอนต์

### เปลี่ยนสีหลัก
```javascript
// tailwind.config.js → theme.extend.colors
'herb-green': {
  700: '#3d7a3a',   // สีเขียวหลัก (ปุ่ม, หัวข้อ)
  800: '#2d5c2a',   // hover state
  900: '#1a3d18',   // hero background
},
'herb-gold': {
  500: '#d4a017',   // สีทอง accent
},
'herb-cream': '#fdf8f0',  // background ครีม
```

### เปลี่ยนฟอนต์
```css
/* src/styles/globals.css */
/* เปลี่ยน import เป็น font ที่ต้องการ: */
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&display=swap');

/* แล้วแก้ใน tailwind.config.js: */
fontFamily: {
  display: ['Kanit', 'sans-serif'],
}
```

---

## วิธีเพิ่มฟิลด์ใหม่ในสินค้า

```typescript
// 1. เพิ่มใน src/lib/models/Product.ts:
weight: { type: String, default: '' },  // เพิ่มฟิลด์ น้ำหนัก

// 2. เพิ่มใน TypeScript interface:
weight?: string

// 3. เพิ่ม input ใน src/components/admin/ProductForm.tsx:
<input name="weight" value={formData.weight} ... />

// 4. เพิ่ม state ใน formData:
weight: initialData?.weight || '',
```

---

## การ Deploy บน Vercel (ฟรี)

```bash
# 1. Push code ขึ้น GitHub

# 2. ไปที่ vercel.com → New Project → Import จาก GitHub

# 3. ใส่ Environment Variables:
MONGODB_URI=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
ADMIN_SECRET=รหัสผ่านที่ต้องการ

# 4. Deploy!
```

### MongoDB Atlas — อนุญาต Vercel IP
```
MongoDB Atlas → Network Access → Add IP Address
→ "Allow Access from Anywhere" (0.0.0.0/0)
```

---

## FAQ

| ปัญหา | วิธีแก้ |
|-------|--------|
| เพิ่มสินค้าแล้วไม่เห็น | ตรวจสอบ `isVisible = true` ใน Admin |
| อัพโหลดรูปไม่ได้ | ตรวจ Cloudinary credentials ใน .env.local |
| เข้า Admin ไม่ได้ | ตรวจ `ADMIN_SECRET` ใน .env.local |
| MongoDB ต่อไม่ติด | เปิด Network Access ใน Atlas → 0.0.0.0/0 |
| รูปไม่แสดง | ตรวจว่า `res.cloudinary.com` อยู่ใน next.config.js |

---

Made with 💚 by Senior Full Stack Developer
