/**
 * 📁 src/app/admin/layout.tsx
 * -------------------------------------------------------
 * Layout สำหรับ Admin Panel ทุกหน้า
 *
 * 📌 วิธีเข้าใช้งาน:
 *   http://localhost:3000/admin
 *   ใส่รหัส ADMIN_SECRET จาก .env.local
 *
 * 📌 การ Authentication:
 *   ใช้ sessionStorage เก็บ secret key
 *   (สำหรับ Production ควรใช้ NextAuth.js แทน)
 * -------------------------------------------------------
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Panel | สมุนไพรไทย',
  robots: 'noindex, nofollow', // ไม่ให้ Google index หน้า admin
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
