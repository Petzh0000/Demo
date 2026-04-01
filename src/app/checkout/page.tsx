'use client'
/**
 * 📁 src/app/checkout/page.tsx
 * -------------------------------------------------------
 * หน้า Checkout — กรอกข้อมูลและชำระเงิน
 *
 * 📌 วิธีเปลี่ยนรูป QR PromptPay:
 *   1. บันทึกรูป QR จากแอปธนาคาร ชื่อไฟล์: promptpay-qr.jpg
 *   2. วางไว้ที่ /public/images/promptpay-qr.jpg
 *   3. รูปจะแสดงอัตโนมัติในหน้าชำระเงิน
 *
 * 📌 วิธีเปลี่ยนชื่อบัญชีที่แสดง:
 *   แก้ PROMPTPAY_NAME ด้านล่าง
 *
 * 📌 วิธีเปลี่ยนเบอร์ PromptPay:
 *   แก้ PROMPTPAY_PHONE ด้านล่าง
 * -------------------------------------------------------
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import {
  ArrowLeft, ShoppingCart, MapPin, Phone, User,
  CreditCard, Truck, QrCode, CheckCircle, Upload,
  Loader2, Info, ChevronRight, Copy, Check
} from 'lucide-react'

// ─── ตั้งค่าข้อมูล PromptPay ───
const PROMPTPAY_NAME = 'นายกนกพล ขจรบุญ'   // ← ชื่อบัญชี
const PROMPTPAY_PHONE = '062-576-7672'               // ← เบอร์/เลขบัตร (แสดงให้ลูกค้าเห็น)
const PROMPTPAY_QR_IMAGE = '/images/promptpay-qr.jpg' // ← path รูป QR (วางใน /public/images/)

const SHIPPING_FEE = 50
const FREE_SHIPPING_MIN = 500

interface FormData {
  name: string
  phone: string
  address: string
  district: string
  province: string
  postalCode: string
  note: string
  savedAddress: boolean
}

const INIT_FORM: FormData = {
  name: '', phone: '', address: '', district: '',
  province: '', postalCode: '', note: '', savedAddress: false,
}

const PROVINCES = [
  'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร',
  'ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท','ชัยภูมิ',
  'ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก',
  'นครปฐม','นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์',
  'นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี',
  'ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา',
  'พะเยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี',
  'เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน',
  'ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี',
  'ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล',
  'สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี',
  'สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์',
  'หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี',
  'อุตรดิตถ์','อุทัยธานี','อุบลราชธานี',
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, itemCount } = useCart()
  const [form, setForm] = useState<FormData>(INIT_FORM)
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'cod'>('qr')
  const [errors, setErrors] = useState<Partial<FormData & { general: string }>>({})
  const [step, setStep] = useState<'form' | 'payment'>('form')
  const [orderId, setOrderId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lookingUp, setLookingUp] = useState(false)
  const [slipFile, setSlipFile] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState('')
  const [uploadingSlip, setUploadingSlip] = useState(false)
  const [copied, setCopied] = useState(false)
  const phoneTimer = useRef<NodeJS.Timeout>()
  const slipRef = useRef<HTMLInputElement>(null)

  const shippingFee = total >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
  const grandTotal = total + shippingFee

  // Redirect ถ้า cart ว่าง
  useEffect(() => {
    if (itemCount === 0) router.push('/shop')
  }, [itemCount, router])

  // ─── Auto-fill ที่อยู่จากเบอร์โทร ───
  const handlePhoneChange = (value: string) => {
    setForm(prev => ({ ...prev, phone: value }))
    clearTimeout(phoneTimer.current)
    if (value.length >= 9) {
      setLookingUp(true)
      phoneTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/customers?phone=${value}`)
          const data = await res.json()
          if (data.found) {
            setForm(prev => ({
              ...prev,
              name: data.customer.name,
              address: data.customer.address,
              district: data.customer.district,
              province: data.customer.province,
              postalCode: data.customer.postalCode,
            }))
          }
        } catch { /* ignore */ } finally { setLookingUp(false) }
      }, 600)
    }
  }

  // ─── Copy เบอร์ PromptPay ───
  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PROMPTPAY_PHONE.replace(/-/g, ''))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ─── Validate ───
  const validate = () => {
    const e: Partial<FormData & { general: string }> = {}
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ-นามสกุล'
    if (!form.phone.trim() || form.phone.length < 9) e.phone = 'กรุณากรอกเบอร์โทรให้ถูกต้อง'
    if (!form.address.trim()) e.address = 'กรุณากรอกที่อยู่'
    if (!form.district.trim()) e.district = 'กรุณากรอกอำเภอ/เขต'
    if (!form.province) e.province = 'กรุณาเลือกจังหวัด'
    if (!form.postalCode.trim() || form.postalCode.length < 5) e.postalCode = 'กรุณากรอกรหัสไปรษณีย์'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ─── Submit สร้างออเดอร์ ───
  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            productId: i._id, name: i.name, nameEn: i.nameEn,
            price: i.price, quantity: i.quantity, imageUrl: i.imageUrl,
          })),
          customer: { ...form },
          paymentMethod,
          totalAmount: grandTotal,
          shippingFee,
          note: form.note,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setOrderId(data.order._id)
      setOrderNumber(data.order.orderNumber)

      if (paymentMethod === 'cod') {
        clearCart()
        router.push(`/checkout/success?order=${data.order.orderNumber}&method=cod`)
      } else {
        // QR: เปลี่ยนไปหน้าแสดง QR รูปจริง
        setStep('payment')
      }
    } catch (err: any) {
      setErrors({ general: err.message })
    } finally { setSubmitting(false) }
  }

  // ─── Upload สลิป ───
  const handleSlipUpload = async () => {
    if (!slipFile || !orderId) return
    setUploadingSlip(true)
    try {
      const fd = new FormData()
      fd.append('slip', slipFile)
      fd.append('orderId', orderId)
      const res = await fetch(`/api/orders/${orderId}`, { method: 'PUT', body: fd })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      clearCart()
      router.push(`/checkout/success?order=${orderNumber}&method=qr`)
    } catch (err: any) {
      alert('Upload สลิปไม่สำเร็จ: ' + err.message)
    } finally { setUploadingSlip(false) }
  }

  if (itemCount === 0) return null

  // ══════════════════════════════════════════
  // หน้าแสดง QR PromptPay (รูปจริง)
  // ══════════════════════════════════════════
  if (step === 'payment') {
    return (
      <main>
        <Navbar />
        <div className="min-h-screen bg-herb-cream pt-28 pb-16">
          <div className="max-w-lg mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-herb-green-800 to-herb-green-700 px-6 py-5 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-display font-extrabold text-xl text-white">สแกนชำระเงิน</h2>
                <p className="font-display text-white/80 text-sm mt-1">
                  ออเดอร์ <span className="font-bold text-herb-gold-300">{orderNumber}</span>
                </p>
              </div>

              <div className="p-6">
                {/* ยอดที่ต้องชำระ */}
                <div className="bg-herb-green-50 border border-herb-green-200 rounded-xl px-5 py-4 text-center mb-5">
                  <p className="font-display text-herb-green-600 text-sm mb-1">ยอดที่ต้องโอน</p>
                  <p className="font-display font-black text-herb-green-700 text-4xl">
                    ฿{grandTotal.toLocaleString()}
                  </p>
                </div>

                {/* รูป QR จริง */}
                <div className="flex flex-col items-center mb-5">
                  <p className="font-display text-gray-500 text-xs mb-3">
                    สแกน QR ด้วย Mobile Banking ทุกธนาคาร
                  </p>
                  <div className="relative">
                    {/* วงกรอบ QR */}
                    <div className="p-3 bg-white border-4 border-herb-green-200 rounded-2xl shadow-md">
                      <div className="relative w-56 h-56">
                        <Image
                          src={PROMPTPAY_QR_IMAGE}
                          alt="QR PromptPay"
                          fill
                          className="object-contain rounded-lg"
                          onError={(e) => {
                            // ถ้าไม่พบรูป → แสดง placeholder
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg gap-2">
                                <span style="font-size:48px">📱</span>
                                <p style="font-family:sans-serif;font-size:12px;color:#6b7280;text-align:center;padding:0 12px">
                                  วางรูป QR ที่<br/>/public/images/promptpay-qr.jpg
                                </p>
                              </div>`
                          }}
                        />
                      </div>
                    </div>
                    {/* PromptPay badge */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#1a56db] text-white font-display font-bold text-xs px-4 py-1.5 rounded-full shadow whitespace-nowrap">
                      PromptPay / พร้อมเพย์
                    </div>
                  </div>
                </div>

                {/* ชื่อ + เบอร์บัญชี */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-bold text-herb-dark text-sm">{PROMPTPAY_NAME}</p>
                      <p className="font-display text-gray-500 text-sm">{PROMPTPAY_PHONE}</p>
                    </div>
                    <button
                      onClick={handleCopyPhone}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-display font-semibold text-xs transition-all ${
                        copied
                          ? 'bg-herb-green-100 text-herb-green-700'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-herb-green-400'
                      }`}
                    >
                      {copied ? <><Check className="w-3 h-3" />คัดลอกแล้ว</> : <><Copy className="w-3 h-3" />คัดลอก</>}
                    </button>
                  </div>
                </div>

                {/* ขั้นตอน */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5">
                  <p className="font-display font-bold text-blue-700 text-sm mb-2">📱 ขั้นตอนการชำระเงิน</p>
                  <ol className="space-y-1">
                    {[
                      'เปิดแอป Mobile Banking ของคุณ',
                      'เลือก "สแกน QR" หรือ "โอนเงินพร้อมเพย์"',
                      `สแกน QR ด้านบน หรือกรอกเบอร์ ${PROMPTPAY_PHONE}`,
                      `ตรวจสอบชื่อ "${PROMPTPAY_NAME}"`,
                      `กรอกยอด ฿${grandTotal.toLocaleString()} แล้วยืนยัน`,
                      'ถ่ายสลิป แล้วแนบด้านล่าง',
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 font-display text-blue-700 text-xs">
                        <span className="w-4 h-4 bg-blue-200 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Upload สลิป */}
                <div className="border-2 border-dashed border-gray-200 hover:border-herb-green-300 rounded-xl p-5 mb-4 transition-colors">
                  <p className="font-display font-semibold text-gray-600 text-sm mb-3 text-center">
                    📎 แนบสลิปการโอนเงิน
                  </p>
                  {slipPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-36 h-48 rounded-xl overflow-hidden border-2 border-herb-green-200">
                        <Image src={slipPreview} alt="สลิป" fill className="object-cover" />
                      </div>
                      <button
                        onClick={() => { setSlipFile(null); setSlipPreview('') }}
                        className="text-gray-400 hover:text-red-500 font-display text-xs underline transition-colors"
                      >
                        เปลี่ยนรูปสลิป
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => slipRef.current?.click()}
                      className="w-full py-5 flex flex-col items-center gap-2 text-gray-400 hover:text-herb-green-600 rounded-xl transition-all"
                    >
                      <Upload className="w-8 h-8" />
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
                      if (f) { setSlipFile(f); setSlipPreview(URL.createObjectURL(f)) }
                    }}
                  />
                </div>

                {/* ปุ่มยืนยัน */}
                <button
                  onClick={handleSlipUpload}
                  disabled={!slipFile || uploadingSlip}
                  className="w-full flex items-center justify-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-display font-bold py-4 rounded-xl transition-all"
                >
                  {uploadingSlip
                    ? <><Loader2 className="w-5 h-5 animate-spin" />กำลังส่งสลิป...</>
                    : <><CheckCircle className="w-5 h-5" />ยืนยันการชำระเงิน</>
                  }
                </button>

                <p className="font-display text-gray-400 text-xs text-center mt-3">
                  ทีมงานจะตรวจสอบและยืนยันออเดอร์ภายใน 1-2 ชั่วโมง
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // ══════════════════════════════════════════
  // หน้ากรอกข้อมูล (Form Step)
  // ══════════════════════════════════════════
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-herb-cream pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-herb-green-700 font-display text-sm mb-6">
            <ArrowLeft className="w-4 h-4" />กลับเลือกสินค้า
          </Link>

          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-herb-dark mb-8">
            🛒 ชำระเงิน
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ─── Left: Form ─── */}
            <div className="lg:col-span-2 space-y-5">

              {/* ข้อมูลผู้รับ */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-display font-bold text-herb-dark text-lg mb-5 flex items-center gap-2">
                  <User className="w-5 h-5 text-herb-green-600" />ข้อมูลผู้รับ
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* เบอร์โทร */}
                  <div className="sm:col-span-2">
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => handlePhoneChange(e.target.value)}
                        placeholder="0812345678"
                        maxLength={10}
                        className={`w-full pl-10 pr-10 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 transition-all ${errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'}`}
                      />
                      {lookingUp && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-herb-green-500 animate-spin" />}
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs font-display mt-1">{errors.phone}</p>}
                    <p className="text-gray-400 text-xs font-display mt-1 flex items-center gap-1">
                      <Info className="w-3 h-3" />กรอกเบอร์เพื่อดึงข้อมูลที่อยู่อัตโนมัติ
                    </p>
                  </div>

                  {/* ชื่อ */}
                  <div className="sm:col-span-2">
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="ชื่อ นามสกุล"
                      className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 transition-all ${errors.name ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs font-display mt-1">{errors.name}</p>}
                  </div>
                </div>
              </div>

              {/* ที่อยู่จัดส่ง */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-display font-bold text-herb-dark text-lg mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-herb-green-600" />ที่อยู่จัดส่ง
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ที่อยู่ */}
                  <div className="sm:col-span-2">
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                      ที่อยู่ (บ้านเลขที่ ถนน ซอย) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.address}
                      onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      rows={2} placeholder="เช่น 99/55 หมู่ 7 ถ.เพชรเกษม"
                      className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 resize-none transition-all ${errors.address ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs font-display mt-1">{errors.address}</p>}
                  </div>

                  {/* อำเภอ */}
                  <div>
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                      อำเภอ/เขต <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" value={form.district}
                      onChange={e => setForm(p => ({ ...p, district: e.target.value }))}
                      placeholder="เช่น สามพราน"
                      className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 transition-all ${errors.district ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'}`}
                    />
                    {errors.district && <p className="text-red-500 text-xs font-display mt-1">{errors.district}</p>}
                  </div>

                  {/* จังหวัด */}
                  <div>
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                      จังหวัด <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.province}
                      onChange={e => setForm(p => ({ ...p, province: e.target.value }))}
                      className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 bg-white transition-all ${errors.province ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'}`}
                    >
                      <option value="">เลือกจังหวัด</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.province && <p className="text-red-500 text-xs font-display mt-1">{errors.province}</p>}
                  </div>

                  {/* รหัสไปรษณีย์ */}
                  <div>
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                      รหัสไปรษณีย์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text" value={form.postalCode}
                      onChange={e => setForm(p => ({ ...p, postalCode: e.target.value }))}
                      placeholder="73210" maxLength={5}
                      className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 transition-all ${errors.postalCode ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'}`}
                    />
                    {errors.postalCode && <p className="text-red-500 text-xs font-display mt-1">{errors.postalCode}</p>}
                  </div>

                  {/* หมายเหตุ */}
                  <div className="sm:col-span-2">
                    <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">หมายเหตุ (ถ้ามี)</label>
                    <input
                      type="text" value={form.note}
                      onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                      placeholder="เช่น ฝากไว้หน้าบ้าน"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
                    />
                  </div>

                  {/* ─── Checkbox บันทึกที่อยู่ด้วยเบอร์โทร ─── */}
                  <div className="sm:col-span-2">
                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-herb-green-50 border border-herb-green-100 rounded-xl hover:bg-herb-green-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.savedAddress}
                        onChange={e => setForm(p => ({ ...p, savedAddress: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 accent-herb-green-700 cursor-pointer flex-shrink-0"
                      />
                      <div>
                        <p className="font-display font-semibold text-herb-green-800 text-sm">
                          📌 บันทึกที่อยู่ด้วยเบอร์โทรนี้
                        </p>
                        <p className="font-display text-herb-green-600 text-xs mt-0.5 leading-relaxed">
                          ครั้งถัดไปกรอกเบอร์โทรเดิม ระบบจะ auto-fill ที่อยู่ให้อัตโนมัติ
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* วิธีชำระเงิน */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-display font-bold text-herb-dark text-lg mb-5 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-herb-green-600" />วิธีชำระเงิน
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* QR PromptPay */}
                  <button
                    onClick={() => setPaymentMethod('qr')}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'qr' ? 'border-herb-green-500 bg-herb-green-50' : 'border-gray-200 hover:border-herb-green-300'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === 'qr' ? 'bg-herb-green-700' : 'bg-gray-100'}`}>
                      <QrCode className={`w-5 h-5 ${paymentMethod === 'qr' ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-herb-dark text-sm">QR PromptPay</p>
                      <p className="font-display text-gray-500 text-xs mt-0.5">สแกนจ่ายผ่าน Mobile Banking ทุกธนาคาร</p>
                    </div>
                    {paymentMethod === 'qr' && <CheckCircle className="w-5 h-5 text-herb-green-600 flex-shrink-0" />}
                  </button>

                  {/* COD */}
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === 'cod' ? 'border-herb-green-500 bg-herb-green-50' : 'border-gray-200 hover:border-herb-green-300'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === 'cod' ? 'bg-herb-green-700' : 'bg-gray-100'}`}>
                      <Truck className={`w-5 h-5 ${paymentMethod === 'cod' ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-display font-bold text-herb-dark text-sm">เก็บเงินปลายทาง (COD)</p>
                      <p className="font-display text-gray-500 text-xs mt-0.5">ชำระเมื่อรับสินค้า</p>
                    </div>
                    {paymentMethod === 'cod' && <CheckCircle className="w-5 h-5 text-herb-green-600 flex-shrink-0" />}
                  </button>
                </div>
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-600 font-display text-sm px-4 py-3 rounded-xl">
                  ⚠️ {errors.general}
                </div>
              )}
            </div>

            {/* ─── Right: Order Summary ─── */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="font-display font-bold text-herb-dark text-lg mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-herb-green-600" />สรุปคำสั่งซื้อ
                </h2>

                {/* รายการสินค้า */}
                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-herb-green-50 flex-shrink-0">
                        {item.imageUrl
                          ? <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-medium text-herb-dark text-xs leading-tight line-clamp-2">{item.name}</p>
                        <p className="font-display text-gray-400 text-xs">× {item.quantity}</p>
                      </div>
                      <span className="font-display font-bold text-herb-green-700 text-sm flex-shrink-0">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ยอดรวม */}
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between font-display text-sm text-gray-600">
                    <span>ยอดสินค้า</span><span>฿{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-display text-sm text-gray-600">
                    <span>ค่าจัดส่ง</span>
                    <span className={shippingFee === 0 ? 'text-herb-green-600 font-semibold' : ''}>
                      {shippingFee === 0 ? 'ฟรี!' : `฿${shippingFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-display font-black text-herb-dark text-lg pt-2 border-t border-gray-100">
                    <span>รวมทั้งสิ้น</span>
                    <span className="text-herb-green-700">฿{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* ปุ่ม Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-5 flex items-center justify-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-60 text-white font-display font-bold py-4 rounded-xl transition-all hover:shadow-lg"
                >
                  {submitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" />กำลังสร้างออเดอร์...</>
                    : <>{paymentMethod === 'qr' ? <QrCode className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                        ยืนยันคำสั่งซื้อ
                        <ChevronRight className="w-4 h-4" /></>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
