import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { NEWS } from '@/lib/data'

const CATEGORY_COLORS: Record<string, string> = {
  'ประกาศสำคัญ': 'bg-red-50 text-red-600 border-red-200',
  'ข่าวสาร': 'bg-blue-50 text-blue-600 border-blue-200',
  'ธุรกิจ': 'bg-green-50 text-green-600 border-green-200',
}

export default function NewsSection() {
  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
          <div>
            <span className="inline-block bg-herb-green-50 text-herb-green-700 font-display font-semibold text-sm px-4 py-2 rounded-full mb-4">
              ข่าวสาร
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-herb-dark">
              กิจกรรม & <span className="text-gradient">ข่าวสาร</span>
            </h2>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1.5 text-herb-green-700 font-display font-semibold text-sm hover:gap-3 transition-all mt-4 sm:mt-0"
          >
            ดูทั้งหมด <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS.map((news, i) => (
            <Link
              key={news.id}
              href={`/news/${news.id}`}
              className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className={`h-48 relative overflow-hidden ${
                i === 0 ? 'bg-gradient-to-br from-herb-green-100 to-herb-green-200' :
                i === 1 ? 'bg-gradient-to-br from-herb-gold-100 to-amber-200' :
                'bg-gradient-to-br from-blue-50 to-indigo-100'
              }`}>
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                  {i === 0 ? '📢' : i === 1 ? '🤝' : '🌏'}
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-display font-semibold border ${CATEGORY_COLORS[news.category]}`}>
                    <Tag className="w-3 h-3" />
                    {news.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-display mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  {news.date}
                </div>
                <h3 className="font-display font-bold text-herb-dark text-base mb-2 leading-snug group-hover:text-herb-green-700 transition-colors line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-gray-500 text-sm font-display leading-relaxed line-clamp-2">
                  {news.excerpt}
                </p>
                <div className="flex items-center gap-1 mt-4 text-herb-green-700 font-display font-semibold text-sm group-hover:gap-2 transition-all">
                  อ่านต่อ <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
