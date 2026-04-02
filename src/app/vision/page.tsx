'use client'
import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'

interface VisionContent {
  heroTitle?: string
  visionStatement?: string
  visionDesc?: string
  missionItems?: string[]
  values?: { icon: string; title: string; desc: string }[]
}

export default function VisionPage() {
  const [content, setContent] = useState<VisionContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/page-content/vision')
      .then(r => r.json())
      .then(d => { if (d.found) setContent(d.content) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <main><Navbar />
      <div className="min-h-screen flex items-center justify-center bg-herb-cream">
        <div className="text-center"><div className="text-4xl animate-spin mb-3">🌿</div><p className="font-display text-gray-400">กำลังโหลด...</p></div>
      </div>
    <Footer /></main>
  )

  if (!content) return (
    <main><Navbar />
      <PageHero title="วิสัย" highlight="ทัศน์" emoji="🎯" />
      <div className="min-h-[40vh] flex items-center justify-center bg-herb-cream">
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📝</p>
          <p className="font-display font-bold text-gray-400 text-xl mb-2">ยังไม่มีเนื้อหา</p>
          <p className="font-display text-gray-300">เพิ่มได้ที่ <a href="/admin/content" className="text-herb-green-600 underline">/admin/content</a></p>
        </div>
      </div>
    <Footer /></main>
  )

  return (
    <main>
      <Navbar />
      <PageHero title={content.heroTitle || 'วิสัยทัศน์'} emoji="🎯" />

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision statement */}
          {content.visionStatement && (
            <div className="bg-gradient-to-br from-herb-green-50 to-herb-green-100 border border-herb-green-200 rounded-3xl p-10 text-center mb-16">
              <div className="text-5xl mb-5">🌿</div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-herb-green-800 mb-5 leading-relaxed">
                "{content.visionStatement}"
              </h2>
              {content.visionDesc && (
                <p className="text-herb-green-700 font-display max-w-2xl mx-auto leading-relaxed">
                  {content.visionDesc}
                </p>
              )}
            </div>
          )}

          {/* Mission */}
          {content.missionItems && content.missionItems.length > 0 && (
            <>
              <h2 className="font-display font-extrabold text-3xl text-herb-dark text-center mb-10">พันธกิจ</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                {content.missionItems.map((m, i) => (
                  <div key={i} className="flex items-start gap-4 bg-herb-cream rounded-2xl p-5">
                    <div className="w-8 h-8 bg-herb-green-700 text-white rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="font-display text-gray-700 leading-relaxed">{m}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Values */}
          {content.values && content.values.length > 0 && (
            <>
              <h2 className="font-display font-extrabold text-3xl text-herb-dark text-center mb-8">ค่านิยมองค์กร</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {content.values.map((v, i) => (
                  <div key={i} className="bg-white border border-herb-green-100 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                    <div className="text-4xl mb-3">{v.icon}</div>
                    <h3 className="font-display font-bold text-herb-dark mb-2">{v.title}</h3>
                    <p className="text-gray-500 text-sm font-display leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
