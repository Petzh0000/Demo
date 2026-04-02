'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'
import { Calendar, ArrowRight, Tag } from 'lucide-react'

interface BlogItem {
  id: number; title: string; excerpt: string; content?: string
  date: string; category: string; emoji: string; readTime: string; featured?: boolean
}
interface BlogContent { items?: BlogItem[] }

const CAT_COLORS: Record<string, string> = {
  'สุขภาพ': 'bg-green-50 text-green-700 border-green-200',
  'คู่มือ':  'bg-blue-50 text-blue-700 border-blue-200',
  'สมุนไพร':'bg-herb-green-50 text-herb-green-700 border-herb-green-200',
  'ความรู้': 'bg-purple-50 text-purple-700 border-purple-200',
}

export default function BlogPage() {
  const [content, setContent] = useState<BlogContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/page-content/blog')
      .then(r => r.json())
      .then(d => { if (d.found) setContent(d.content) })
      .finally(() => setLoading(false))
  }, [])

  const items = content?.items ?? []
  const featured = items.find(b => b.featured)
  const rest = items.filter(b => !b.featured)

  if (loading) return (
    <main><Navbar /><div className="min-h-screen flex items-center justify-center bg-herb-cream"><div className="text-4xl animate-spin">🌿</div></div><Footer /></main>
  )

  return (
    <main>
      <Navbar />
      <PageHero title="บทความ" highlight="สมุนไพรไทย" subtitle="ความรู้เรื่องสมุนไพรและการดูแลสุขภาพ" emoji="📖" />

      <section className="py-12 bg-herb-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">📖</p>
              <p className="font-display font-bold text-gray-400 text-xl mb-2">ยังไม่มีบทความ</p>
              <p className="font-display text-gray-300">เพิ่มบทความได้ที่ <a href="/admin/content" className="text-herb-green-600 underline">/admin/content</a></p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-56 md:h-full bg-gradient-to-br from-herb-green-50 to-herb-green-100 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-500">
                      {featured.emoji}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-display font-semibold border ${CAT_COLORS[featured.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          <Tag className="w-3 h-3" />{featured.category}
                        </span>
                        <span className="bg-herb-green-100 text-herb-green-700 text-xs font-display font-semibold px-3 py-1 rounded-full">⭐ แนะนำ</span>
                        <span className="text-gray-400 text-xs font-display">⏱ {featured.readTime}</span>
                      </div>
                      <h2 className="font-display font-extrabold text-2xl text-herb-dark mb-3 leading-snug">{featured.title}</h2>
                      <p className="text-gray-500 font-display mb-4 leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm font-display">
                        <Calendar className="w-4 h-4" />{featured.date}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((blog, i) => (
                    <div key={blog.id || i} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">
                      <div className="h-40 bg-gradient-to-br from-herb-green-50 to-herb-green-100 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                        {blog.emoji}
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-display font-semibold border ${CAT_COLORS[blog.category] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                            {blog.category}
                          </span>
                          <span className="text-gray-400 text-xs font-display">⏱ {blog.readTime}</span>
                        </div>
                        <h3 className="font-display font-bold text-herb-dark text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{blog.title}</h3>
                        <p className="text-gray-400 text-xs font-display line-clamp-2 mb-3">{blog.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-400 text-xs font-display">
                            <Calendar className="w-3.5 h-3.5" />{blog.date}
                          </div>
                          <span className="text-herb-green-700 font-display font-semibold text-xs flex items-center gap-1">
                            อ่านต่อ <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
