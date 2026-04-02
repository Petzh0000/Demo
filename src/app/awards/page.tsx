'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'

interface AwardsContent {
  heroTitle?: string
  intro?: string
  awards?: { icon: string; title: string; year: string; org: string; desc: string }[]
  certifications?: string[]
}

export default function AwardsPage() {
  const [content, setContent] = useState<AwardsContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/page-content/awards')
      .then(r => r.json())
      .then(d => { if (d.found) setContent(d.content) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <main><Navbar /><div className="min-h-screen flex items-center justify-center bg-herb-cream"><div className="text-4xl animate-spin">🌿</div></div><Footer /></main>
  )

  if (!content) return (
    <main><Navbar /><PageHero title="รางวัล &" highlight="การรับรอง" emoji="🏆" />
      <div className="min-h-[40vh] flex items-center justify-center bg-herb-cream">
        <div className="text-center py-16"><p className="text-5xl mb-4">📝</p><p className="font-display font-bold text-gray-400 text-xl">ยังไม่มีเนื้อหา</p><p className="font-display text-gray-300 mt-2">เพิ่มได้ที่ <a href="/admin/content" className="text-herb-green-600 underline">/admin/content</a></p></div>
      </div>
    <Footer /></main>
  )

  return (
    <main>
      <Navbar />
      <PageHero title={content.heroTitle || 'รางวัล &'} highlight="การรับรอง" emoji="🏆" />

      <section className="py-20 bg-herb-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {content.intro && (
            <p className="text-center font-display text-gray-600 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
              {content.intro}
            </p>
          )}

          {content.awards && content.awards.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {content.awards.map((a, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{a.icon}</div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display font-bold text-herb-dark text-base leading-tight flex-1 mr-2">{a.title}</h3>
                    <span className="bg-herb-green-50 text-herb-green-700 font-display font-bold text-xs px-2.5 py-1 rounded-full flex-shrink-0">{a.year}</span>
                  </div>
                  <p className="text-herb-green-600 font-display font-semibold text-xs mb-2">{a.org}</p>
                  <p className="text-gray-500 text-sm font-display leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          )}

          {content.certifications && content.certifications.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <h2 className="font-display font-bold text-2xl text-herb-dark mb-6">มาตรฐานที่ได้รับการรับรอง</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {content.certifications.map((c, i) => (
                  <div key={i} className="w-24 h-24 bg-gradient-to-br from-herb-green-50 to-herb-green-100 border-2 border-herb-green-200 rounded-2xl flex items-center justify-center">
                    <span className="font-display font-black text-herb-green-700 text-sm text-center leading-tight px-2">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
