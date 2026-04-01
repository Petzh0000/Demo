'use client'
/**
 * 📁 src/app/admin/products/[id]/page.tsx
 * -------------------------------------------------------
 * หน้าแก้ไขสินค้า (Admin)
 *
 * 📌 Flow:
 *   1. ดึงข้อมูลสินค้าจาก MongoDB ด้วย ID จาก URL
 *   2. แสดง ProductForm พร้อม prefill ข้อมูลเดิม
 *   3. แก้ไขและกด "บันทึก"
 *   4. ถ้าเปลี่ยนรูป → upload รูปใหม่ไป Cloudinary ก่อน
 *   5. PUT /api/products/:id → อัพเดท MongoDB
 *   6. Redirect กลับ /admin/products
 *
 * 📌 URL Parameter:
 *   /admin/products/664abc123def456 → id = 664abc123def456
 * -------------------------------------------------------
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Leaf, Loader2 } from 'lucide-react'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [adminSecret, setAdminSecret] = useState('')
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const secret = sessionStorage.getItem('adminSecret')
    if (!secret) {
      router.push('/admin')
      return
    }
    setAdminSecret(secret)

    // ดึงข้อมูลสินค้า
    fetch(`/api/products/${params.id}`, {
      headers: { 'x-admin-secret': secret },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.product)
        } else {
          setNotFound(true)
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [params.id, router])

  const handleSuccess = (updated: any) => {
    alert(`✅ แก้ไขสินค้า "${updated.name}" สำเร็จ!`)
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
          <span className="font-display text-herb-green-700 text-sm font-semibold">แก้ไขสินค้า</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-herb-green-700 font-display text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับรายการสินค้า
        </Link>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-herb-green-600 animate-spin" />
          </div>
        ) : notFound ? (
          <div className="text-center py-20">
            <p className="font-display font-bold text-gray-400 text-xl mb-2">ไม่พบสินค้า</p>
            <Link href="/admin/products" className="text-herb-green-700 font-display underline">
              กลับรายการสินค้า
            </Link>
          </div>
        ) : (
          <>
            <h1 className="font-display font-extrabold text-2xl text-herb-dark mb-2">
              ✏️ แก้ไขสินค้า
            </h1>
            <p className="text-gray-400 font-display text-sm mb-6">
              ID: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{params.id}</code>
            </p>

            <ProductForm
              initialData={product}
              adminSecret={adminSecret}
              onSuccess={handleSuccess}
            />
          </>
        )}
      </div>
    </div>
  )
}
