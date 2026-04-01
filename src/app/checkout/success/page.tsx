'use client'
/**
 * 📁 src/app/checkout/success/page.tsx
 * -------------------------------------------------------
 * หน้ายืนยันการสั่งซื้อสำเร็จ
 *
 * URL: /checkout/success?order=ORD-20240615-XXXX&method=qr|cod
 * -------------------------------------------------------
 */

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { CheckCircle, Package, Truck, QrCode, Home, Search } from 'lucide-react'

function SuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') || ''
  const method = params.get('method') || 'cod'

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {/* Icon */}
      <div className="w-20 h-20 bg-herb-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-herb-green-600" />
      </div>

      <h1 className="font-display font-extrabold text-3xl text-herb-dark mb-3">
        สั่งซื้อสำเร็จ! 🎉
      </h1>

      <p className="font-display text-gray-500 mb-2">เลขที่คำสั่งซื้อของคุณ</p>
      <div className="inline-block bg-herb-green-50 border-2 border-herb-green-200 rounded-xl px-6 py-3 mb-6">
        <span className="font-display font-black text-herb-green-700 text-xl">{orderNumber}</span>
      </div>

      {/* Payment status */}
      <div className={`rounded-2xl p-5 mb-8 ${method === 'qr' ? 'bg-blue-50 border border-blue-200' : 'bg-amber-50 border border-amber-200'}`}>
        {method === 'qr' ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <span className="font-display font-bold text-blue-700">ชำระด้วย QR PromptPay</span>
            </div>
            <p className="font-display text-blue-600 text-sm">
              ได้รับสลิปของคุณแล้ว ทีมงานจะตรวจสอบและยืนยันออเดอร์ภายใน 1-2 ชั่วโมง
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <span className="font-display font-bold text-amber-700">เก็บเงินปลายทาง (COD)</span>
            </div>
            <p className="font-display text-amber-600 text-sm">
              ชำระเงินเมื่อได้รับสินค้า ทีมงานจะจัดส่งภายใน 1-3 วันทำการ
            </p>
          </>
        )}
      </div>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: CheckCircle, label: 'รับออเดอร์', color: 'text-herb-green-600', bg: 'bg-herb-green-100', done: true },
          { icon: Package, label: 'จัดเตรียมสินค้า', color: 'text-amber-500', bg: 'bg-amber-50', done: false },
          { icon: Truck, label: 'จัดส่ง', color: 'text-gray-400', bg: 'bg-gray-100', done: false },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${s.bg}`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <span className="font-display text-xs text-gray-600">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-herb-green-400 text-gray-700 font-display font-semibold px-6 py-3 rounded-xl transition-all"
        >
          <Home className="w-4 h-4" />กลับหน้าแรก
        </Link>
        <Link
          href="/shop"
          className="flex items-center justify-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold px-6 py-3 rounded-xl transition-all"
        >
          <Search className="w-4 h-4" />เลือกสินค้าต่อ
        </Link>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-herb-cream pt-20">
        <Suspense fallback={<div className="text-center py-20"><p className="font-display text-gray-400">กำลังโหลด...</p></div>}>
          <SuccessContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
