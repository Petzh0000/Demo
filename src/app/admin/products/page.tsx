'use client'
/**
 * 📁 src/app/admin/products/page.tsx
 * -------------------------------------------------------
 * หน้าแสดงรายการสินค้าทั้งหมด (Admin)
 *
 * 📌 ฟีเจอร์:
 *   - แสดงตารางสินค้าทั้งหมดจาก MongoDB
 *   - เพิ่มสินค้าใหม่ → ปุ่ม "เพิ่มสินค้า" → /admin/products/new
 *   - แก้ไขสินค้า → ปุ่ม Edit → /admin/products/[id]
 *   - ลบสินค้า → ปุ่ม Delete → confirm dialog
 *   - Toggle แสดง/ซ่อนสินค้า (isVisible)
 *
 * 📌 วิธีเพิ่มคอลัมน์ใหม่ในตาราง:
 *   ไปที่ส่วน <thead> และ <tbody> เพิ่ม <th> และ <td>
 * -------------------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  LogOut, Package, RefreshCw, Search, Leaf
} from 'lucide-react'

interface Product {
  _id: string
  name: string
  nameEn?: string
  price: number
  imageUrl: string
  category: string
  badge?: string
  isVisible: boolean
  inStock: boolean
  createdAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  massage: '💆 นวด',
  inhale: '🌬️ ดม',
  gift: '🎁 ของชำร่วย',
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [filtered, setFiltered] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [adminSecret, setAdminSecret] = useState('')

  // ─── ดึง admin secret จาก sessionStorage ───
  useEffect(() => {
    const secret = sessionStorage.getItem('adminSecret')
    if (!secret) {
      router.push('/admin')
      return
    }
    setAdminSecret(secret)
  }, [router])

  // ─── ดึงสินค้าจาก API ───
  const fetchProducts = useCallback(async () => {
    if (!adminSecret) return
    setLoading(true)
    try {
      const res = await fetch('/api/products?admin=1', {
        headers: { 'x-admin-secret': adminSecret },
      })
      const data = await res.json()
      if (data.success) {
        setProducts(data.products)
        setFiltered(data.products)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [adminSecret])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // ─── ค้นหา ───
  useEffect(() => {
    if (!search) {
      setFiltered(products)
    } else {
      const q = search.toLowerCase()
      setFiltered(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.nameEn || '').toLowerCase().includes(q)
        )
      )
    }
  }, [search, products])

  // ─── ลบสินค้า ───
  const handleDelete = async (product: Product) => {
    if (!confirm(`ยืนยันลบสินค้า "${product.name}" ?\n(รูปภาพจะถูกลบออกจาก Cloudinary ด้วย)`)) return

    setDeletingId(product._id)
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminSecret },
      })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== product._id))
      } else {
        alert('ลบไม่สำเร็จ: ' + data.message)
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setDeletingId(null)
    }
  }

  // ─── Toggle แสดง/ซ่อนสินค้า ───
  const handleToggleVisible = async (product: Product) => {
    setTogglingId(product._id)
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify({ isVisible: !product.isVisible }),
      })
      const data = await res.json()
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, isVisible: !p.isVisible } : p))
        )
      }
    } catch {
      alert('เกิดข้อผิดพลาด')
    } finally {
      setTogglingId(null)
    }
  }

  // ─── Logout ───
  const handleLogout = () => {
    sessionStorage.removeItem('adminSecret')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Top Bar ─── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-herb-green-700 rounded-full flex items-center justify-center">
              <Leaf className="text-white w-4 h-4" />
            </div>
            <span className="font-display font-bold text-herb-dark text-sm">Admin Panel</span>
            <span className="text-gray-300 text-sm">/</span>
            <span className="font-display text-herb-green-700 text-sm font-semibold">ผลิตภัณฑ์</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/orders" className="text-gray-500 hover:text-herb-green-700 font-display text-xs font-semibold">
              📦 ออเดอร์
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-gray-500 hover:text-herb-green-700 font-display text-xs"
            >
              ดูหน้าเว็บ ↗
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 font-display text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              ออก
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Title + Actions ─── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-herb-green-700" />
            <div>
              <h1 className="font-display font-extrabold text-2xl text-herb-dark">จัดการผลิตภัณฑ์</h1>
              <p className="text-gray-400 font-display text-sm">
                ทั้งหมด {products.length} รายการ
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 hover:text-herb-green-700 hover:border-herb-green-300 font-display font-medium text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              รีเฟรช
            </button>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-1.5 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              เพิ่มสินค้า
            </Link>
          </div>
        </div>

        {/* ─── Search ─── */}
        <div className="relative mb-5 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
          />
        </div>

        {/* ─── Table ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-4xl animate-spin mb-3">🌿</div>
                <p className="font-display text-gray-400">กำลังโหลด...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="w-12 h-12 text-gray-200 mb-4" />
              <p className="font-display font-bold text-gray-400 text-lg">ยังไม่มีสินค้า</p>
              <p className="font-display text-gray-300 text-sm mb-5">เริ่มต้นด้วยการเพิ่มสินค้าชิ้นแรก</p>
              <Link
                href="/admin/products/new"
                className="flex items-center gap-1.5 bg-herb-green-700 text-white font-display font-bold text-sm px-5 py-2.5 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                เพิ่มสินค้า
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">รูป</th>
                    <th className="text-left px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">ชื่อสินค้า</th>
                    <th className="text-left px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">หมวดหมู่</th>
                    <th className="text-left px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">ราคา</th>
                    <th className="text-left px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">สต็อก</th>
                    <th className="text-left px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">แสดง</th>
                    <th className="text-center px-5 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, i) => (
                    <tr
                      key={product._id}
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                        !product.isVisible ? 'opacity-50' : ''
                      }`}
                    >
                      {/* รูป */}
                      <td className="px-5 py-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-herb-green-50 flex items-center justify-center">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-xl">📦</span>
                          )}
                        </div>
                      </td>

                      {/* ชื่อ */}
                      <td className="px-5 py-3">
                        <div className="font-display font-semibold text-herb-dark text-sm">{product.name}</div>
                        {product.nameEn && (
                          <div className="font-display text-gray-400 text-xs">{product.nameEn}</div>
                        )}
                        {product.badge && (
                          <span className="inline-block mt-1 bg-herb-green-100 text-herb-green-700 text-[10px] font-display font-bold px-1.5 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </td>

                      {/* หมวดหมู่ */}
                      <td className="px-5 py-3">
                        <span className="font-display text-gray-600 text-sm">
                          {CATEGORY_LABELS[product.category] || product.category}
                        </span>
                      </td>

                      {/* ราคา */}
                      <td className="px-5 py-3">
                        <span className="font-display font-bold text-herb-green-700">
                          ฿{product.price.toLocaleString()}
                        </span>
                      </td>

                      {/* สต็อก */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-display font-semibold ${
                          product.inStock
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {product.inStock ? '✅ มี' : '❌ หมด'}
                        </span>
                      </td>

                      {/* แสดง/ซ่อน */}
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleToggleVisible(product)}
                          disabled={togglingId === product._id}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-display font-semibold transition-all ${
                            product.isVisible
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          title={product.isVisible ? 'คลิกเพื่อซ่อน' : 'คลิกเพื่อแสดง'}
                        >
                          {togglingId === product._id ? (
                            '...'
                          ) : product.isVisible ? (
                            <><Eye className="w-3 h-3" /> แสดง</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> ซ่อน</>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}`}
                            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors"
                            title="แก้ไข"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
                            title="ลบ"
                          >
                            {deletingId === product._id ? (
                              <span className="text-xs">...</span>
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-gray-300 text-xs font-display mt-6">
          Admin Panel — สมุนไพรไทย
        </p>
      </div>
    </div>
  )
}
