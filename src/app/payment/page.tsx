'use client'
/**
 * 📁 src/app/payment/page.tsx
 * วิธีชำระเงิน + ค้นหาออเดอร์ค้างจ่าย
 *
 * 📌 เปลี่ยนข้อมูล PromptPay:
 *   แก้ PROMPTPAY_NAME และ PROMPTPAY_PHONE ด้านล่าง
 * 📌 เปลี่ยนรูป QR:
 *   วางรูปที่ /public/images/promptpay-qr.jpg
 */

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'
import Image from 'next/image'
import Link from 'next/link'
import {
  Phone, QrCode, Truck, Search, Loader2,
  Upload, CheckCircle, Clock, ShoppingBag,
  X, Copy, Check
} from 'lucide-react'

const PROMPTPAY_NAME  = 'บริษัท สมุนไพรไทย จำกัด'
const PROMPTPAY_PHONE = '081-234-5678'
const PROMPTPAY_QR    = '/images/promptpay-qr.jpg'
const SHIPPING_FEE    = 50

interface OrderItem { name: string; quantity: number; price: number; imageUrl: string }
interface Order {
  _id: string
  orderNumber: string
  totalAmount: number
  paymentMethod: 'qr' | 'cod'
  paymentStatus: 'pending' | 'paid' | 'cancelled'
  orderStatus: string
  items: OrderItem[]
  createdAt: string
}

export default function PaymentPage() {
  const router = useRouter()

  // search state
  const [phone, setPhone]         = useState('')
  const [searching, setSearching] = useState(false)
  const [orders, setOrders]       = useState<Order[]>([])
  const [searched, setSearched]   = useState(false)

  // pay modal state
  const [selected, setSelected]       = useState<Order | null>(null)
  const [slipFile, setSlipFile]       = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState('')
  const [uploading, setUploading]     = useState(false)

  // copy state
  const [copied, setCopied] = useState(false)

  const slipRef = useRef<HTMLInputElement>(null)

  /* ── copy phone ── */
  const copyPhone = () => {
    navigator.clipboard.writeText(PROMPTPAY_PHONE.replace(/-/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── format date ── */
  const fmt = (d: string) =>
    new Date(d).toLocaleString('th-TH', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  /* ── search unpaid orders ── */
  const handleSearch = async () => {
    if (phone.length < 9) return
    setSearching(true)
    setSearched(false)
    try {
      const res  = await fetch(`/api/orders/by-phone?phone=${phone}`)
      const data = await res.json()
      const unpaid = (data.orders ?? []).filter(
        (o: Order) => o.paymentMethod === 'qr' && o.paymentStatus === 'pending'
      )
      setOrders(unpaid)
    } catch {
      setOrders([])
    } finally {
      setSearching(false)
      setSearched(true)
    }
  }

  /* ── upload slip ── */
  const handleUpload = async () => {
    if (!slipFile || !selected) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('slip', slipFile)
      fd.append('orderId', selected._id)
      const res  = await fetch(`/api/orders/${selected._id}`, { method: 'PUT', body: fd })
      const data = await res.json()
      if (data.success) {
        router.push(`/checkout/success?order=${selected.orderNumber}&method=qr`)
      } else {
        alert('ส่งสลิปไม่สำเร็จ: ' + data.message)
      }
    } catch {
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setUploading(false)
    }
  }

  /* ── open pay modal ── */
  const openPay = (o: Order) => {
    setSelected(o)
    setSlipFile(null)
    setSlipPreview('')
  }

  /* ────────────────────────────────── JSX ────────────────────────────────── */
  return (
    <main>
      <Navbar />
      <PageHero
        title="วิธี"
        highlight="ชำระเงิน"
        subtitle="เลือกวิธีที่สะดวกสำหรับคุณ"
        emoji="💳"
      />

      <section className="py-12 bg-herb-cream min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* ══════════ วิธีชำระเงิน 2 แบบ ══════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* ── QR PromptPay ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex items-center gap-3">
                <QrCode className="w-6 h-6 text-white" />
                <h2 className="font-display font-extrabold text-white text-lg">QR PromptPay</h2>
              </div>

              <div className="p-6">
                {/* รูป QR */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 border-4 border-blue-100 rounded-2xl bg-white shadow-sm">
                    <div className="relative w-40 h-40">
                      <Image
                        src={PROMPTPAY_QR}
                        alt="QR PromptPay"
                        fill
                        className="object-contain rounded-lg"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement
                          t.style.display = 'none'
                          if (t.parentElement) {
                            t.parentElement.innerHTML =
                              '<div class="w-full h-full flex items-center justify-center text-5xl">📱</div>'
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ชื่อ + เบอร์ */}
                <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                  <p className="font-display font-bold text-blue-800">{PROMPTPAY_NAME}</p>
                  <p className="font-display text-blue-600 text-xl font-black">{PROMPTPAY_PHONE}</p>
                  <button
                    onClick={copyPhone}
                    className={`mt-2 inline-flex items-center gap-1.5 text-xs font-display font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    {copied ? <><Check className="w-3 h-3" />คัดลอกแล้ว</> : <><Copy className="w-3 h-3" />คัดลอกเบอร์</>}
                  </button>
                </div>

                {/* ขั้นตอน */}
                <p className="font-display font-bold text-herb-dark text-sm mb-2">📱 ขั้นตอนการชำระ</p>
                <div className="space-y-2 mb-4">
                  {[
                    'เปิดแอป Mobile Banking',
                    'เลือก "สแกน QR" หรือ "โอนพร้อมเพย์"',
                    `กรอกเบอร์ ${PROMPTPAY_PHONE} หรือสแกน QR`,
                    `ตรวจสอบชื่อ "${PROMPTPAY_NAME}"`,
                    'กรอกยอด แล้วยืนยัน',
                    'ถ่ายสลิป → แนบในขั้นตอนสุดท้าย',
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="font-display text-gray-600 text-sm">{s}</p>
                    </div>
                  ))}
                </div>

                {/* ค่าบริการ */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                  <p className="font-display text-amber-700 text-xs">
                    💡 <strong>ค่าบริการ:</strong> ไม่มีค่าธรรมเนียมเพิ่ม
                    จ่ายตามราคาสินค้า + ค่าจัดส่ง ฿{SHIPPING_FEE}
                    (ฟรีเมื่อซื้อครบ ฿500)
                  </p>
                </div>
              </div>
            </div>

            {/* ── COD ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-400 px-6 py-4 flex items-center gap-3">
                <Truck className="w-6 h-6 text-white" />
                <h2 className="font-display font-extrabold text-white text-lg">เก็บเงินปลายทาง (COD)</h2>
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center text-6xl">
                    🚚
                  </div>
                </div>

                <p className="font-display font-bold text-herb-dark text-sm mb-2">🚚 ขั้นตอนการชำระ</p>
                <div className="space-y-2 mb-4">
                  {[
                    'สั่งสินค้าและกรอกที่อยู่จัดส่ง',
                    'ทีมงานยืนยันออเดอร์และจัดส่ง',
                    'รอรับพัสดุ (1–3 วันทำการ)',
                    'ชำระเงินสดให้คนส่งพัสดุ',
                    'รับสินค้าพร้อมใบเสร็จ',
                  ].map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="font-display text-gray-600 text-sm">{s}</p>
                    </div>
                  ))}
                </div>

                {/* ค่าบริการ */}
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-3">
                  <p className="font-display text-amber-800 text-sm font-bold mb-2">💰 การคิดค่าบริการ COD</p>
                  <div className="space-y-1 font-display text-sm text-amber-700">
                    <div className="flex justify-between">
                      <span>ราคาสินค้า</span><span>ตามจริง</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ค่าจัดส่ง</span><span>฿{SHIPPING_FEE}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-amber-200 pt-1 mt-1">
                      <span>รวมชำระปลายทาง</span>
                      <span>ราคาสินค้า + ฿{SHIPPING_FEE}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <p className="font-display text-red-600 text-xs">
                    ⚠️ กรุณาเตรียมเงินสดให้พอดีเพื่อความสะดวก
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════ ค้นหาออเดอร์ค้างจ่าย ══════════ */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-herb-green-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-herb-green-700" />
              </div>
              <div>
                <h2 className="font-display font-extrabold text-herb-dark text-xl">
                  ค้นหาออเดอร์ที่ยังไม่ได้ชำระ
                </h2>
                <p className="font-display text-gray-400 text-sm">
                  สั่งซื้อไปแล้วแต่ยังไม่ได้โอนเงิน? ค้นหาด้วยเบอร์โทร
                </p>
              </div>
            </div>

            {/* Search input */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="กรอกเบอร์โทรที่ใช้สั่งสินค้า"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching || phone.length < 9}
                className="flex items-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold px-5 py-3 rounded-xl transition-all whitespace-nowrap"
              >
                {searching
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Search className="w-4 h-4" />}
                ค้นหา
              </button>
            </div>

            {/* Results */}
            {searched && (
              <div className="mt-5">
                {orders.length === 0 ? (
                  <div className="flex flex-col items-center py-8 bg-gray-50 rounded-xl text-center">
                    <span className="text-3xl mb-2">✅</span>
                    <p className="font-display font-bold text-gray-500">ไม่พบออเดอร์ที่ค้างชำระ</p>
                    <p className="font-display text-gray-400 text-sm mt-1">
                      ออเดอร์ทั้งหมดชำระเรียบร้อยแล้ว หรือลองตรวจสอบเบอร์โทรอีกครั้ง
                    </p>
                    <Link
                      href="/shop"
                      className="mt-4 inline-flex items-center gap-2 bg-herb-green-700 text-white font-display font-bold text-sm px-5 py-2.5 rounded-full hover:bg-herb-green-800 transition-all"
                    >
                      🛒 ไปสั่งสินค้าใหม่
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="font-display font-semibold text-herb-green-700 text-sm">
                      พบ {orders.length} ออเดอร์ที่รอชำระเงิน
                    </p>
                    {orders.map(order => (
                      <div
                        key={order._id}
                        className="border border-amber-200 bg-amber-50 rounded-xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-display font-black text-herb-green-700 text-sm">
                                {order.orderNumber}
                              </span>
                              <span className="bg-amber-200 text-amber-700 text-[10px] font-display font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />รอชำระ
                              </span>
                            </div>
                            <p className="font-display text-gray-500 text-xs">{fmt(order.createdAt)}</p>
                            <div className="mt-2 space-y-0.5">
                              {order.items.slice(0, 2).map((item, i) => (
                                <p key={i} className="font-display text-gray-600 text-xs">
                                  • {item.name} × {item.quantity}
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="font-display text-gray-400 text-xs">
                                  และอีก {order.items.length - 2} รายการ
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-display font-black text-herb-green-700 text-xl">
                              ฿{order.totalAmount.toLocaleString()}
                            </p>
                            <button
                              onClick={() => openPay(order)}
                              className="mt-2 flex items-center gap-1.5 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold text-sm px-4 py-2 rounded-xl transition-all"
                            >
                              <QrCode className="w-4 h-4" />
                              ชำระเงินเดี๋ยวนี้
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center bg-herb-green-50 rounded-2xl p-8 border border-herb-green-100">
            <p className="font-display font-bold text-herb-dark text-xl mb-2">ยังไม่ได้สั่งสินค้า?</p>
            <p className="font-display text-gray-500 mb-5">เลือกสินค้าและสั่งซื้อได้เลยครับ</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg hover:-translate-y-1"
            >
              🛒 ไปเลือกสินค้า
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════ Modal ชำระเงิน ══════════ */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-display font-extrabold text-herb-dark">ชำระเงิน</h3>
                <p className="font-display text-herb-green-700 font-bold text-sm">
                  {selected.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {/* ยอดชำระ */}
              <div className="bg-herb-green-50 border border-herb-green-200 rounded-xl px-5 py-4 text-center mb-5">
                <p className="font-display text-herb-green-600 text-sm mb-1">ยอดที่ต้องโอน</p>
                <p className="font-display font-black text-herb-green-700 text-4xl">
                  ฿{selected.totalAmount.toLocaleString()}
                </p>
              </div>

              {/* QR รูปจริง */}
              <div className="flex flex-col items-center mb-5">
                <div className="p-3 bg-white border-4 border-herb-green-200 rounded-2xl shadow-md mb-3">
                  <div className="relative w-52 h-52">
                    <Image
                      src={PROMPTPAY_QR}
                      alt="QR"
                      fill
                      className="object-contain rounded-lg"
                      onError={(e) => {
                        const t = e.target as HTMLImageElement
                        t.style.display = 'none'
                        if (t.parentElement) {
                          t.parentElement.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center text-6xl">📱</div>'
                        }
                      }}
                    />
                  </div>
                </div>
                <p className="font-display font-bold text-herb-dark">{PROMPTPAY_NAME}</p>
                <p className="font-display text-gray-500 text-sm">{PROMPTPAY_PHONE}</p>
              </div>

              {/* Upload สลิป */}
              <div className="border-2 border-dashed border-gray-200 hover:border-herb-green-300 rounded-xl p-5 mb-4 transition-colors">
                <p className="font-display font-semibold text-gray-600 text-sm mb-3 text-center">
                  📎 แนบสลิปการโอนเงิน
                </p>
                {slipPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-32 h-40 rounded-xl overflow-hidden border-2 border-herb-green-200">
                      <Image src={slipPreview} alt="สลิป" fill className="object-cover" />
                    </div>
                    <button
                      onClick={() => { setSlipFile(null); setSlipPreview('') }}
                      className="text-gray-400 hover:text-red-500 font-display text-xs underline transition-colors"
                    >
                      เปลี่ยนรูป
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => slipRef.current?.click()}
                    className="w-full py-4 flex flex-col items-center gap-2 text-gray-400 hover:text-herb-green-600 rounded-xl transition-all"
                  >
                    <Upload className="w-7 h-7" />
                    <span className="font-display text-sm">คลิกเพื่อเลือกรูปสลิป</span>
                    <span className="font-display text-xs text-gray-300">JPG, PNG (ไม่เกิน 10MB)</span>
                  </button>
                )}
                <input
                  ref={slipRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) {
                      setSlipFile(f)
                      setSlipPreview(URL.createObjectURL(f))
                    }
                  }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleUpload}
                disabled={!slipFile || uploading}
                className="w-full flex items-center justify-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold py-4 rounded-xl transition-all"
              >
                {uploading
                  ? <><Loader2 className="w-5 h-5 animate-spin" />กำลังส่ง...</>
                  : <><CheckCircle className="w-5 h-5" />ยืนยันการชำระเงิน</>}
              </button>

              <p className="font-display text-gray-400 text-xs text-center mt-3">
                ทีมงานจะตรวจสอบและยืนยันออเดอร์ภายใน 1–2 ชั่วโมง
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
