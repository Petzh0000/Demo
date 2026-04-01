import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/data'

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-herb-green-900 to-herb-green-700 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-[300px] text-white font-display font-black absolute -top-20 -left-10 leading-none select-none">
          30
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-white/20 text-white font-display font-semibold text-sm px-4 py-2 rounded-full mb-4">
            เสียงจากลูกค้า
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-4">
            ทำไมต้องเลือก <span className="text-herb-gold-300">สมุนไพรไทย?</span>
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-white/30" />
            <span className="text-white/60 text-xl">💬</span>
            <div className="h-px w-16 bg-white/30" />
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <Quote className="w-8 h-8 text-herb-gold-300 mb-4 opacity-80" />
              <p className="text-white font-display leading-relaxed mb-5 text-sm">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-herb-gold-500 rounded-full flex items-center justify-center font-display font-bold text-white text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-white/60 text-xs font-display">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-herb-gold-300 fill-herb-gold-300" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Big quote */}
        <div className="text-center">
          <div className="inline-block bg-white/10 border border-white/20 rounded-2xl px-8 py-6 max-w-2xl">
            <p className="font-display font-bold text-white text-xl sm:text-2xl leading-relaxed">
              "สมุนไพรไทย ยาหม่องและน้ำมันนวด
              <span className="text-herb-gold-300"> สมุนไพรไทยที่คนทั่วโลกวางใจ</span>"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
