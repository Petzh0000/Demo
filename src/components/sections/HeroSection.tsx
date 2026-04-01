'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Star } from 'lucide-react'

const SLIDES = [
  {
    headline: 'ยาหม่องสมุนไพรไทย',
    subheadline: 'ที่คนทั่วโลกวางใจ',
    desc: 'จากภูมิปัญญาไทย สู่มาตรฐานระดับโลก บรรเทาปวดเมื่อย คลายกล้ามเนื้อ กลิ่นหอมเป็นเอกลักษณ์',
    badge: 'อันดับ 1 ในไทย',
    gradient: 'from-herb-green-900 via-herb-green-800 to-herb-green-700',
    accent: 'herb-gold-500',
    emoji: '🌿',
  },
  {
    headline: 'น้ำมันนวดสมุนไพร',
    subheadline: 'สูตรพิเศษเฉพาะตัว',
    desc: 'ผสานสมุนไพรไทยหลากชนิด เหมาะสำหรับนักกีฬา หมอนวด และผู้ที่ต้องการผ่อนคลาย',
    badge: 'สูตรใหม่ล่าสุด',
    gradient: 'from-herb-green-800 via-emerald-800 to-teal-700',
    accent: 'herb-gold-300',
    emoji: '💆',
  },
  {
    headline: 'ของฝากสมุนไพรไทย',
    subheadline: 'ของชำร่วยระดับพรีเมียม',
    desc: 'เหมาะสำหรับนักท่องเที่ยว ของขวัญ ของชำร่วย สร้างความประทับใจในโอกาสต่างๆ',
    badge: 'Best Souvenir',
    gradient: 'from-amber-900 via-herb-green-800 to-herb-green-700',
    accent: 'herb-gold-300',
    emoji: '🎁',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length)
        setAnimating(false)
      }, 300)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const slide = SLIDES[current]

  return (
    <section className={`relative min-h-screen bg-gradient-to-br ${slide.gradient} transition-all duration-1000 overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M30 15c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15S30 23.284 30 15zM0 45c0-8.284 6.716-15 15-15s15 6.716 15 15-6.716 15-15 15S0 53.284 0 45z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating leaf decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: '10%', left: '5%', size: 80, delay: '0s', opacity: 0.15 },
          { top: '20%', right: '8%', size: 60, delay: '2s', opacity: 0.12 },
          { top: '60%', left: '3%', size: 50, delay: '4s', opacity: 0.1 },
          { bottom: '15%', right: '5%', size: 90, delay: '1s', opacity: 0.13 },
          { top: '40%', right: '15%', size: 40, delay: '3s', opacity: 0.1 },
        ].map((leaf, i) => (
          <div
            key={i}
            className="absolute text-white"
            style={{
              top: leaf.top,
              left: (leaf as any).left,
              right: (leaf as any).right,
              bottom: (leaf as any).bottom,
              opacity: leaf.opacity,
              fontSize: leaf.size,
              animation: `float ${6 + i}s ease-in-out infinite`,
              animationDelay: leaf.delay,
            }}
          >
            🍃
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Text content */}
          <div className={`transition-all duration-500 ${animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-herb-gold-300 fill-herb-gold-300" />
              <span className="text-white text-sm font-display font-medium">{slide.badge}</span>
            </div>

            <h1 className="font-display font-extrabold text-white leading-tight mb-3">
              <span className="block text-4xl sm:text-5xl lg:text-6xl">{slide.headline}</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl text-herb-gold-300 mt-1">
                {slide.subheadline}
              </span>
            </h1>

            <p className="text-white/80 text-lg font-display leading-relaxed mb-8 max-w-md">
              {slide.desc}
            </p>

            {/* Stats */}
            <div className="flex gap-8 mb-8">
              {[
                { value: '30+', label: 'ปีที่ผลิต' },
                { value: '50+', label: 'ประเทศ' },
                { value: '1M+', label: 'ลูกค้า' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-black text-2xl text-herb-gold-300">{stat.value}</div>
                  <div className="text-white/60 text-xs font-display">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-herb-gold-500 hover:bg-herb-gold-700 text-white font-display font-bold px-7 py-3.5 rounded-full transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
              >
                สั่งซื้อเลย
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white font-display font-semibold px-7 py-3.5 rounded-full transition-all"
              >
                เรียนรู้เพิ่มเติม
              </Link>
            </div>

            {/* Distribution channels */}
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-white/50 text-xs font-display mb-3">หาซื้อได้ที่</p>
              <div className="flex flex-wrap gap-3">
                {['Watson', '7-Eleven', 'BigC', 'Boots', 'Lazada', 'Shopee'].map((ch) => (
                  <span
                    key={ch}
                    className="bg-white/15 border border-white/20 text-white/80 text-xs font-display px-3 py-1.5 rounded-full"
                  >
                    {ch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Product visual */}
          <div className={`flex items-center justify-center transition-all duration-500 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-herb-gold-500/30 rounded-full blur-3xl scale-110" />

              {/* Product mockup circles */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-spin" style={{ animationDuration: '20s' }}>
                  {[0, 90, 180, 270].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-3 h-3 bg-herb-gold-300 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateX(130px) translateY(-50%)`,
                      }}
                    />
                  ))}
                </div>

                {/* Middle ring */}
                <div className="absolute inset-8 rounded-full border border-white/30" />

                {/* Center product display */}
                <div className="absolute inset-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl border border-white/30">
                  <span className="text-7xl leaf-float" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' }}>
                    {slide.emoji}
                  </span>
                </div>

                {/* Floating product badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-3 py-2 text-center">
                  <div className="font-display font-black text-herb-green-700 text-lg">100%</div>
                  <div className="text-gray-500 text-xs font-display">สมุนไพร</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-herb-gold-500 rounded-2xl shadow-lg px-3 py-2 text-center">
                  <div className="font-display font-bold text-white text-sm">GMP</div>
                  <div className="text-white/80 text-xs font-display">มาตรฐาน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80V40C200 0 400 20 600 10C800 0 1000 30 1200 20V80H0Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
