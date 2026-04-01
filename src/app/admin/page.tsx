'use client'
/**
 * 📁 src/app/admin/page.tsx
 * -------------------------------------------------------
 * หน้า Login ของ Admin Panel
 *
 * 📌 ตรวจสอบรหัสผ่านผ่าน POST /api/auth/verify
 * 📌 รหัสผ่านตั้งค่าได้ที่ .env.local → ADMIN_SECRET
 * -------------------------------------------------------
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Lock, Eye, EyeOff, Package, ShoppingBag } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [secret, setSecret] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!secret.trim()) { setError('กรุณาใส่รหัสผ่าน'); return }
    setLoading(true)
    setError('')

    try {
      // ✅ เรียก API เพื่อตรวจสอบรหัสผ่านจริง
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
      })
      const data = await res.json()

      if (data.success) {
        sessionStorage.setItem('adminSecret', secret)
        router.push('/admin/products')
      } else {
        setError(data.message || 'รหัสผ่านไม่ถูกต้อง')
      }
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-herb-green-900 to-herb-green-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <h1 className="font-display font-extrabold text-white text-2xl">Admin Panel</h1>
          <p className="text-white/60 font-display text-sm mt-1">สมุนไพรไทย — จัดการหลังบ้าน</p>
        </div>

        {/* Quick links (disabled pre-login) */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-center opacity-60">
            <Package className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="font-display text-white text-xs">จัดการสินค้า</p>
          </div>
          <div className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-center opacity-60">
            <ShoppingBag className="w-5 h-5 text-white mx-auto mb-1" />
            <p className="font-display text-white text-xs">จัดการออเดอร์</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-herb-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-herb-green-700" />
            </div>
            <div>
              <h2 className="font-display font-bold text-herb-dark">เข้าสู่ระบบ</h2>
              <p className="text-gray-400 text-xs font-display">ใส่รหัสผ่าน Admin</p>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">รหัสผ่าน (ADMIN_SECRET)</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={secret}
                  onChange={e => setSecret(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
                  placeholder="ใส่รหัสผ่าน..."
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 font-display text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-60 text-white font-display font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />กำลังตรวจสอบ...</>
                : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs font-display mt-4">
            รหัสผ่านตั้งค่าได้ที่ .env.local → <code className="bg-gray-100 px-1 rounded">ADMIN_SECRET</code>
          </p>
        </div>
      </div>
    </div>
  )
}
