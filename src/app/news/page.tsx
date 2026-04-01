import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ข่าวสาร | สมุนไพรไทย',
}

const ALL_NEWS = [
  {
    id: 1,
    title: '5 จุดสังเกตบนฉลาก "วังพรม" ของแท้',
    excerpt: 'เพื่อความปลอดภัยของผู้บริโภค โปรดตรวจสอบฉลากทุกครั้งก่อนซื้อ ด้วย 5 จุดสำคัญที่ช่วยให้ท่านมั่นใจในของแท้',
    date: '15 มีนาคม 2567',
    category: 'ประกาศสำคัญ',
    emoji: '📢',
    featured: true,
  },
  {
    id: 2,
    title: 'สมุนไพรวังพรมต่อสัญญาความร่วมมือกับบริษัท มัณฑนา มาร์เก็ตติ้ง จำกัด ในเครือ BJC ครบรอบ 10 ปี',
    excerpt: 'สมุนไพรวังพรมต่อสัญญาความร่วมมือกับบริษัทในเครือ BJC อย่างเป็นทางการ หลังร่วมงานกันมานาน 10 ปี',
    date: '10 กุมภาพันธ์ 2567',
    category: 'ข่าวสาร',
    emoji: '🤝',
    featured: false,
  },
  {
    id: 3,
    title: 'สมุนไพรวังพรมต่อสัญญายักษ์ใหญ่เวียงจันทน์ KSD กระจายสินค้าในลาวทั่วประเทศ',
    excerpt: 'การขยายตลาดสู่ประเทศลาวอย่างเป็นทางการ ผ่านพันธมิตรทางธุรกิจที่แข็งแกร่ง',
    date: '5 มกราคม 2567',
    category: 'ธุรกิจ',
    emoji: '🌏',
    featured: false,
  },
  {
    id: 4,
    title: 'เปิดตัวผลิตภัณฑ์ใหม่! น้ำมันนวดสูตรร้อนสำหรับนักกีฬา',
    excerpt: 'สูตรพิเศษที่ผสานสมุนไพรไทยกับเทคโนโลยีสมัยใหม่ เพื่อการฟื้นฟูกล้ามเนื้อที่มีประสิทธิภาพ',
    date: '20 ธันวาคม 2566',
    category: 'ผลิตภัณฑ์',
    emoji: '🔥',
    featured: false,
  },
  {
    id: 5,
    title: 'ออกบูธแสดงสินค้า THAIFEX 2567 ณ อิมแพ็ค เมืองทองธานี',
    excerpt: 'พบกับผลิตภัณฑ์ใหม่และโปรโมชั่นพิเศษในงาน THAIFEX งานแสดงสินค้าอาหารและเครื่องดื่มระดับโลก',
    date: '15 พฤษภาคม 2567',
    category: 'กิจกรรม',
    emoji: '🎪',
    featured: false,
  },
  {
    id: 6,
    title: 'วิธีเลือกยาหม่องที่เหมาะกับคุณ',
    excerpt: 'คู่มือเลือกยาหม่องสมุนไพรให้เหมาะกับการใช้งาน ไม่ว่าจะเป็นการบรรเทาปวด คลายเส้น หรือสูดดม',
    date: '1 มีนาคม 2567',
    category: 'บทความ',
    emoji: '📖',
    featured: false,
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'ประกาศสำคัญ': 'bg-red-50 text-red-600 border-red-100',
  'ข่าวสาร': 'bg-blue-50 text-blue-600 border-blue-100',
  'ธุรกิจ': 'bg-green-50 text-green-600 border-green-100',
  'ผลิตภัณฑ์': 'bg-purple-50 text-purple-600 border-purple-100',
  'กิจกรรม': 'bg-amber-50 text-amber-600 border-amber-100',
  'บทความ': 'bg-gray-50 text-gray-600 border-gray-200',
}

export default function NewsPage() {
  const featured = ALL_NEWS.find(n => n.featured)
  const rest = ALL_NEWS.filter(n => !n.featured)

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            ข่าวสาร &<span className="text-herb-gold-300"> กิจกรรม</span>
          </h1>
          <p className="text-white/80 font-display text-lg">
            ติดตามความเคลื่อนไหวและข่าวสารล่าสุดจากสมุนไพรไทย
          </p>
        </div>
      </section>

      <section className="py-12 bg-herb-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured */}
          {featured && (
            <Link
              href={`/news/${featured.id}`}
              className="group block bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-56 md:h-full bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-500">
                  {featured.emoji}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-semibold border ${CATEGORY_COLORS[featured.category]}`}>
                      <Tag className="w-3 h-3" />
                      {featured.category}
                    </span>
                    <span className="bg-herb-green-100 text-herb-green-700 text-xs font-display font-semibold px-3 py-1 rounded-full">
                      🔔 ข่าวเด่น
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl text-herb-dark mb-3 group-hover:text-herb-green-700 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 font-display mb-4 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm font-display">
                      <Calendar className="w-4 h-4" />
                      {featured.date}
                    </div>
                    <span className="flex items-center gap-1 text-herb-green-700 font-display font-semibold text-sm group-hover:gap-2 transition-all">
                      อ่านต่อ <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* News grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-40 bg-gradient-to-br from-herb-green-50 to-herb-green-100 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                  {news.emoji}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-display font-semibold border ${CATEGORY_COLORS[news.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {news.category}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-herb-dark text-sm leading-snug mb-2 group-hover:text-herb-green-700 transition-colors line-clamp-2 min-h-[2.5rem]">
                    {news.title}
                  </h3>
                  <p className="text-gray-400 text-xs font-display line-clamp-2 mb-3">{news.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-display">
                      <Calendar className="w-3.5 h-3.5" />
                      {news.date}
                    </div>
                    <span className="text-herb-green-700 font-display font-semibold text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                      อ่านต่อ <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
