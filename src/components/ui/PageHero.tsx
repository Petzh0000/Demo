'use client'
/**
 * 📁 src/components/ui/PageHero.tsx
 * -------------------------------------------------------
 * Hero banner สำหรับหน้าภายใน (/about, /vision, /awards, /news, /blog)
 * แสดงเป็น gradient สีเขียว + ข้อความ
 *
 * 📌 วิธีใช้:
 *   <PageHero title="เกี่ยวกับ" highlight="เรา" subtitle="..." />
 * -------------------------------------------------------
 */

interface PageHeroProps {
  title: string
  highlight?: string
  subtitle?: string
  emoji?: string
}

export default function PageHero({ title, highlight, subtitle, emoji }: PageHeroProps) {
  return (
    <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 text-[200px] flex items-center justify-end pr-16 select-none pointer-events-none leading-none">
        {emoji || '🌿'}
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
          {title}
          {highlight && <span className="text-herb-gold-300"> {highlight}</span>}
        </h1>
        {subtitle && (
          <p className="text-white/80 font-display text-lg max-w-xl mx-auto">{subtitle}</p>
        )}
      </div>
    </section>
  )
}
