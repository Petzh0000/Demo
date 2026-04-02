'use client'
/**
 * 📁 src/app/about/page.tsx
 * ดึงเนื้อหาจาก MongoDB ผ่าน /api/page-content/about
 * แก้ไขเนื้อหาได้ที่ /admin/content
 */

import { useEffect, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/ui/PageHero'

interface AboutContent {
  heroTitle?: string
  heroHighlight?: string
  heroDesc?: string
  storyHeadline?: string
  storySubheadline?: string
  paragraphs?: string[]
  stats?: { val: string; label: string; icon: string }[]
  timeline?: { year: string; title: string; desc: string }[]
  certifications?: string[]
}

export default function AboutPage() {
  const [content, setContent] = useState<AboutContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/page-content/about')
      .then(r => r.json())
      .then(d => { if (d.found) setContent(d.content) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <main>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-herb-cream">
        <div className="text-center"><div className="text-4xl animate-spin mb-3">🌿</div><p className="font-display text-gray-400">กำลังโหลด...</p></div>
      </div>
      <Footer />
    </main>
  )

  if (!content) return (
    <main>
      <Navbar />
      <PageHero title="เกี่ยวกับ" highlight="เรา" emoji="🌿" />
      <div className="min-h-[40vh] flex items-center justify-center bg-herb-cream">
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📝</p>
          <p className="font-display font-bold text-gray-400 text-xl mb-2">ยังไม่มีเนื้อหา</p>
          <p className="font-display text-gray-300">กรุณาเพิ่มเนื้อหาได้ที่ <a href="/admin/content" className="text-herb-green-600 underline">/admin/content</a></p>
        </div>
      </div>
      <Footer />
    </main>
  )

  return (
    <main>
      <Navbar />
      <PageHero
        title={content.heroTitle || 'เกี่ยวกับ'}
        highlight={content.heroHighlight || 'เรา'}
        subtitle={content.heroDesc}
        emoji="🌿"
      />

      {/* Story */}
      {(content.storyHeadline || (content.paragraphs && content.paragraphs.length > 0)) && (
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                {content.storyHeadline && (
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-herb-dark mb-6 leading-tight">
                    {content.storyHeadline}
                    {content.storySubheadline && (
                      <><br /><span className="text-herb-green-600">{content.storySubheadline}</span></>
                    )}
                  </h2>
                )}
                <div className="space-y-4 text-gray-600 font-display leading-relaxed">
                  {content.paragraphs?.map((p, i) => p && <p key={i}>{p}</p>)}
                </div>

                {/* Certifications */}
                {content.certifications && content.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-8">
                    {content.certifications.map((c, i) => (
                      <div key={i} className="px-4 py-2 bg-herb-green-50 border border-herb-green-200 rounded-xl font-display font-bold text-sm text-herb-green-700">
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Stats */}
              {content.stats && content.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {content.stats.map((s, i) => (
                    <div key={i} className="bg-herb-cream border border-herb-green-100 rounded-2xl p-6 text-center">
                      <div className="text-4xl mb-3">{s.icon}</div>
                      <div className="font-display font-black text-3xl text-herb-dark mb-1">{s.val}</div>
                      <div className="text-gray-500 text-sm font-display">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {content.timeline && content.timeline.length > 0 && (
        <section className="py-20 bg-herb-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display font-extrabold text-3xl text-herb-dark text-center mb-12">
              เส้นทาง<span className="text-herb-green-700">ของเรา</span>
            </h2>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-herb-green-200 -translate-x-1/2" />
              <div className="space-y-8">
                {content.timeline.map((item, i) => (
                  <div key={i} className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                      <div className="inline-block bg-white border border-herb-green-100 rounded-2xl p-4 shadow-sm">
                        <div className="font-display font-bold text-herb-green-700 text-base mb-1">{item.title}</div>
                        <div className="text-gray-500 text-sm font-display">{item.desc}</div>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-herb-green-700 text-white rounded-full flex items-center justify-center font-display font-bold text-xs text-center flex-shrink-0 z-10 shadow-lg">
                      {item.year}
                    </div>
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
