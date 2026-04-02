'use client'
/**
 * 📁 src/components/sections/HeroSection.tsx
 * -------------------------------------------------------
 * Hero แบบ Image Slideshow — ดึงรูปจาก MongoDB (Slides collection)
 *
 * 📌 วิธีเพิ่ม/ลบรูปสไลด์:
 *   ไปที่ /admin/slides → อัพโหลดรูปได้เลย
 *
 * 📌 ถ้ายังไม่มีรูปใน DB:
 *   แสดง gradient สีเขียวเป็น fallback
 *
 * 📌 วิธีเปลี่ยนข้อความบน slide:
 *   แก้ HERO_TEXT ด้านล่าง
 * -------------------------------------------------------
 */

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

// ── ข้อความที่แสดงซ้อนบน slide ──
const HERO_TEXT = {
  badge: 'อันดับ 1 ในไทย',
  headline: 'ยาหม่องสมุนไพรไทย',
  subheadline: 'ที่คนทั่วโลกวางใจ',
  desc: 'จากภูมิปัญญาไทย สู่มาตรฐานระดับโลก บรรเทาปวดเมื่อย คลายกล้ามเนื้อ กลิ่นหอมเป็นเอกลักษณ์',
  stats: [
    { value: '30+', label: 'ปีที่ผลิต' },
    { value: '50+', label: 'ประเทศ' },
    { value: '1M+', label: 'ลูกค้า' },
  ],
  channels: ['Watson', '7-Eleven', 'BigC', 'Boots', 'Lazada', 'Shopee'],
}

interface Slide { _id: string; imageUrl: string; order: number }

export default function HeroSection() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasSlides, setHasSlides] = useState(false)

  useEffect(() => {
    fetch('/api/slides')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.slides.length > 0) {
          setSlides(d.slides)
          setHasSlides(true)
        }
      })
      .catch(() => {})
  }, [])

  const goTo = useCallback((idx: number) => {
    if (isAnimating || slides.length === 0) return
    setIsAnimating(true)
    setCurrent((idx + slides.length) % slides.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, slides.length])

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(timer)
  }, [slides.length, current, goTo])

  return (
    <section className="relative min-h-screen overflow-hidden">

      {/* ── Background: รูป slide หรือ gradient fallback ── */}
      {hasSlides ? (
        <>
          {slides.map((slide, i) => (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={slide.imageUrl}
                alt={`slide ${i + 1}`}
                fill
                className="object-cover"
                priority={i === 0}
                sizes="100vw"
              />
              {/* Overlay เข้มเพื่อให้ข้อความอ่านง่าย */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/20" />
            </div>
          ))}
        </>
      ) : (
        // Fallback gradient
        <div className="absolute inset-0 bg-gradient-to-br from-herb-green-900 via-herb-green-800 to-herb-green-700">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 15c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15S30 23.284 30 15zM0 45c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15S0 53.284 0 45z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>
      )}

      {/* ── Floating leaves decoration ── */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: '10%', left: '5%', size: 70, delay: '0s' },
          { top: '20%', right: '8%', size: 50, delay: '2s' },
          { bottom: '20%', left: '3%', size: 45, delay: '4s' },
        ].map((l, i) => (
          <div key={i} className="absolute text-white/10" style={{ top: (l as any).top, left: (l as any).left, right: (l as any).right, bottom: (l as any).bottom, fontSize: l.size, animation: `float ${6 + i}s ease-in-out infinite`, animationDelay: l.delay }}>
            🍃
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-herb-gold-300 fill-herb-gold-300" />
            <span className="text-white text-sm font-display font-medium">{HERO_TEXT.badge}</span>
          </div>

          <h1 className="font-display font-extrabold text-white leading-tight mb-4">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">{HERO_TEXT.headline}</span>
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-herb-gold-300 mt-1">{HERO_TEXT.subheadline}</span>
          </h1>

          <p className="text-white/80 text-lg font-display leading-relaxed mb-8 max-w-lg">{HERO_TEXT.desc}</p>

          {/* Stats */}
          <div className="flex gap-8 mb-8">
            {HERO_TEXT.stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display font-black text-2xl text-herb-gold-300">{s.value}</div>
                <div className="text-white/60 text-xs font-display">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-herb-gold-500 hover:bg-herb-gold-700 text-white font-display font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-xl hover:-translate-y-1">
              สั่งซื้อเลย →
            </Link>
            <Link href="/about" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-display font-semibold px-7 py-3.5 rounded-full transition-all">
              เรียนรู้เพิ่มเติม
            </Link>
          </div>

          {/* Channels */}
          <div>
            <p className="text-white/50 text-xs font-display mb-3">หาซื้อได้ที่</p>
            <div className="flex flex-wrap gap-2">
              {HERO_TEXT.channels.map(ch => (
                <span key={ch} className="bg-white/15 border border-white/20 text-white/80 text-xs font-display px-3 py-1.5 rounded-full">{ch}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide Controls (แสดงเฉพาะเมื่อมีรูป) ── */}
      {slides.length > 1 && (
        <>
          {/* Prev / Next */}
          <button onClick={() => goTo(current - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => goTo(current + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all border border-white/30">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute bottom-20 right-6 z-20 bg-black/30 backdrop-blur-sm text-white text-xs font-display px-3 py-1.5 rounded-full">
            {current + 1} / {slides.length}
          </div>
        </>
      )}

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80V40C200 0 400 20 600 10C800 0 1000 30 1200 20V80H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
