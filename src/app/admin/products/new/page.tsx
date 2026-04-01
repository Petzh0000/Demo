'use client'
/**
 * 📁 src/app/admin/products/new/page.tsx
 * -------------------------------------------------------
 * หน้าเพิ่มสินค้าใหม่ (Admin)
 *
 * 📌 Flow:
 *   1. กรอกข้อมูลสินค้าใน ProductForm
 *   2. เลือกรูปสินค้า
 *   3. กด "เพิ่มสินค้า"
 *   4. รูปถูก upload ไป Cloudinary → ได้ URL กลับมา
 *   5. ข้อมูลสินค้า + imageUrl ถูกบันทึกใน MongoDB
 *   6. Redirect กลับไป /admin/products
 * -------------------------------------------------------
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Leaf } from 'lucide-react'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  const router = useRouter()
  const [adminSecret, setAdminSecret] = useState('')

  useEffect(() => {
    const secret = sessionStorage.getItem('adminSecret')
    if (!secret) {
      router.push('/admin')
      return
    }
    setAdminSecret(secret)
  }, [router])

  const handleSuccess = (product: any) => {
    alert(`✅ เพิ่มสินค้า "${product.name}" สำเร็จ!`)
    router.push('/admin/products')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <div className="w-7 h-7 bg-herb-green-700 rounded-full flex items-center justify-center">
            <Leaf className="text-white w-3.5 h-3.5" />
          </div>
          <span className="font-display font-bold text-herb-dark text-sm">Admin</span>
          <span className="text-gray-300">/</span>
          <Link href="/admin/products" className="font-display text-gray-500 text-sm hover:text-herb-green-700">
            ผลิตภัณฑ์
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-display text-herb-green-700 text-sm font-semibold">เพิ่มสินค้าใหม่</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-herb-green-700 font-display text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับรายการสินค้า
        </Link>

        <h1 className="font-display font-extrabold text-2xl text-herb-dark mb-6">
          ➕ เพิ่มสินค้าใหม่
        </h1>

        {adminSecret && (
          <ProductForm
            adminSecret={adminSecret}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  )
}
