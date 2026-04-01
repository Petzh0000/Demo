import Link from 'next/link'
import { Phone, MessageCircle, ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 bg-herb-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Distribution banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-herb-green-100 shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-herb-dark mb-3">
                หาซื้อได้ที่ไหน?
              </h3>
              <p className="text-gray-500 font-display mb-6 leading-relaxed">
                ผลิตภัณฑ์สมุนไพรไทยของเราวางจำหน่ายตามร้านค้าชั้นนำทั่วประเทศ
                และสั่งซื้อออนไลน์ได้ทุกแพลตฟอร์ม
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: 'Watson', emoji: '💊' },
                  { name: '7-Eleven', emoji: '🏪' },
                  { name: 'BigC', emoji: '🛒' },
                  { name: 'Boots', emoji: '👢' },
                  { name: 'Lazada', emoji: '📱' },
                  { name: 'Shopee', emoji: '🛍️' },
                ].map((ch) => (
                  <div
                    key={ch.name}
                    className="flex items-center gap-2 bg-herb-green-50 border border-herb-green-100 rounded-xl px-3 py-2"
                  >
                    <span className="text-lg">{ch.emoji}</span>
                    <span className="font-display font-semibold text-herb-green-800 text-sm">{ch.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-6xl mb-4">🌍</div>
              <p className="font-display font-bold text-herb-green-700 text-4xl mb-1">50+</p>
              <p className="text-gray-500 font-display">ประเทศทั่วโลก</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-herb-green-800 to-herb-green-700 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          {/* Decoration */}
          <div className="absolute right-0 top-0 bottom-0 opacity-10 text-[180px] flex items-center pr-8 select-none pointer-events-none">
            🌿
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl mb-2">
                สนใจสั่งซื้อจำนวนมาก?
              </h3>
              <p className="text-white/80 font-display">
                ติดต่อฝ่ายขายสำหรับราคาพิเศษและการสั่งซื้อแบบ Wholesale
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <a
                href="tel:034318922"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-display font-semibold px-5 py-3 rounded-full transition-all"
              >
                <Phone className="w-4 h-4" />
                โทรหาเรา
              </a>
              <a
                href="https://line.me"
                className="flex items-center gap-2 bg-[#06C755] hover:bg-[#05a847] text-white font-display font-semibold px-5 py-3 rounded-full transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                LINE
              </a>
              <Link
                href="/shop"
                className="flex items-center gap-2 bg-herb-gold-500 hover:bg-herb-gold-700 text-white font-display font-semibold px-5 py-3 rounded-full transition-all"
              >
                สั่งซื้อเลย
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
