'use client'
/**
 * 📁 src/app/admin/slides/page.tsx
 * จัดการรูปสไลด์ Hero บนหน้าแรก
 *
 * 📌 Logo เป็น Static — วางรูปที่ /public/images/logo.png
 *    (ไม่ต้องจัดการผ่าน Admin อีกต่อไป)
 *
 * 📌 รูปสไลด์แนะนำ: ขนาด 1920×900px (landscape)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Leaf, Plus, Trash2, Eye, EyeOff, Loader2,
  Upload, LogOut, ImageIcon, Info
} from 'lucide-react'

interface Slide {
  _id: string; imageUrl: string; order: number; isVisible: boolean; createdAt: string
}

export default function AdminSlidesPage() {
  const router = useRouter()
  const [adminSecret, setAdminSecret] = useState('')
  const [slides, setSlides]           = useState<Slide[]>([])
  const [loading, setLoading]         = useState(true)
  const [uploading, setUploading]     = useState(false)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [togglingId, setTogglingId]   = useState<string | null>(null)
  const slideInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const secret = sessionStorage.getItem('adminSecret')
    if (!secret) { router.push('/admin'); return }
    setAdminSecret(secret)
  }, [router])

  const fetchSlides = useCallback(async () => {
    if (!adminSecret) return
    setLoading(true)
    try {
      const res = await fetch('/api/slides?admin=1')
      const d   = await res.json()
      if (d.success) setSlides(d.slides)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }, [adminSecret])

  useEffect(() => { fetchSlides() }, [fetchSlides])

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('order', String(slides.length))
      const res = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'x-admin-secret': adminSecret },
        body: fd,
      })
      const d = await res.json()
      if (d.success) setSlides(prev => [...prev, d.slide])
      else alert('อัพโหลดไม่สำเร็จ: ' + d.message)
    } catch { alert('เกิดข้อผิดพลาด') } finally {
      setUploading(false)
      if (slideInputRef.current) slideInputRef.current.value = ''
    }
  }

  const handleDelete = async (slide: Slide) => {
    if (!confirm(`ลบรูปสไลด์นี้?`)) return
    setDeletingId(slide._id)
    try {
      await fetch(`/api/slides/${slide._id}`, {
        method: 'DELETE',
        headers: { 'x-admin-secret': adminSecret },
      })
      setSlides(prev => prev.filter(s => s._id !== slide._id))
    } catch { alert('ลบไม่สำเร็จ') } finally { setDeletingId(null) }
  }

  const handleToggle = async (slide: Slide) => {
    setTogglingId(slide._id)
    try {
      const res = await fetch(`/api/slides/${slide._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
        body: JSON.stringify({ isVisible: !slide.isVisible }),
      })
      const d = await res.json()
      if (d.success) setSlides(prev => prev.map(s => s._id === slide._id ? { ...s, isVisible: !s.isVisible } : s))
    } catch { alert('เกิดข้อผิดพลาด') } finally { setTogglingId(null) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-herb-green-700 rounded-full flex items-center justify-center">
              <Leaf className="text-white w-3.5 h-3.5" />
            </div>
            <Link href="/admin/products" className="font-display text-gray-500 text-sm hover:text-herb-green-700">Admin</Link>
            <span className="text-gray-300">/</span>
            <span className="font-display text-herb-green-700 text-sm font-bold">รูปสไลด์ Hero</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="font-display text-sm text-gray-500 hover:text-herb-green-700">📦 สินค้า</Link>
            <Link href="/admin/orders"   className="font-display text-sm text-gray-500 hover:text-herb-green-700">🛒 ออเดอร์</Link>
            <Link href="/admin/content"  className="font-display text-sm text-gray-500 hover:text-herb-green-700">📝 เนื้อหา</Link>
            <button onClick={() => { sessionStorage.removeItem('adminSecret'); router.push('/admin') }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 font-display text-xs">
              <LogOut className="w-3.5 h-3.5" />ออก
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Logo info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-amber-800 text-sm mb-1">🏷️ เปลี่ยนโลโก้</p>
            <p className="font-display text-amber-700 text-sm">
              วางไฟล์รูปโลโก้ที่ <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">/public/images/logo.png</code> แล้วรัน deploy ใหม่
              <br />แนะนำ: รูปสี่เหลี่ยมจัตุรัส PNG พื้นหลังโปร่งใส ขนาด 200×200px
            </p>
          </div>
        </div>

        {/* Slides section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-herb-green-600" />
              <h2 className="font-display font-extrabold text-herb-dark text-lg">
                รูปสไลด์ Hero
              </h2>
              <span className="bg-herb-green-100 text-herb-green-700 font-display font-bold text-xs px-2 py-0.5 rounded-full">
                {slides.length} รูป
              </span>
            </div>
            <button
              onClick={() => slideInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-50 text-white font-display font-bold text-sm px-4 py-2.5 rounded-xl transition-all"
            >
              {uploading
                ? <><Loader2 className="w-4 h-4 animate-spin" />กำลังอัพโหลด...</>
                : <><Plus className="w-4 h-4" />เพิ่มรูปสไลด์</>}
            </button>
          </div>

          <input
            ref={slideInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
          />

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5">
            <p className="font-display text-blue-700 text-sm">
              💡 <strong>แนะนำ:</strong> รูปขนาด <strong>1920×900px (landscape)</strong> 
              เพื่อให้ครอบคลุมทุกหน้าจอ | รูปจะถูก optimize อัตโนมัติผ่าน Cloudinary
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-herb-green-600 animate-spin" />
            </div>
          ) : slides.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="font-display font-bold text-gray-400 text-lg mb-1">ยังไม่มีรูปสไลด์</p>
              <p className="font-display text-gray-300 text-sm mb-5">
                อัพโหลดรูปเพื่อแสดงใน Hero slideshow บนหน้าแรก<br />
                ถ้าไม่มีรูปจะแสดง gradient สีเขียวแทน
              </p>
              <button
                onClick={() => slideInputRef.current?.click()}
                className="inline-flex items-center gap-2 bg-herb-green-700 text-white font-display font-bold text-sm px-5 py-3 rounded-xl"
              >
                <Upload className="w-4 h-4" />เลือกรูปแรก
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, i) => (
                <div
                  key={slide._id}
                  className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${
                    slide.isVisible ? 'border-gray-100 bg-gray-50' : 'border-gray-100 bg-gray-50 opacity-50'
                  }`}
                >
                  <span className="w-7 h-7 bg-herb-green-100 text-herb-green-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>

                  {/* Preview */}
                  <div className="w-28 h-16 rounded-lg overflow-hidden bg-herb-green-50 flex-shrink-0 border border-gray-100">
                    <Image
                      src={slide.imageUrl}
                      alt={`slide ${i + 1}`}
                      width={112}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-display text-gray-500 text-xs truncate">{slide.imageUrl.split('/').pop()}</p>
                    <p className="font-display text-xs mt-0.5">
                      {slide.isVisible
                        ? <span className="text-herb-green-600">🟢 แสดงอยู่</span>
                        : <span className="text-gray-400">⚫ ซ่อน</span>}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(slide)}
                      disabled={togglingId === slide._id}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        slide.isVisible
                          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={slide.isVisible ? 'ซ่อน' : 'แสดง'}
                    >
                      {togglingId === slide._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : slide.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(slide)}
                      disabled={deletingId === slide._id}
                      className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl flex items-center justify-center transition-colors"
                      title="ลบ"
                    >
                      {deletingId === slide._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
