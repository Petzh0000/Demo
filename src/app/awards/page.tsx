import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'รางวัลรับรองคุณภาพ | สมุนไพรไทย',
}

const AWARDS = [
  { icon: '🏆', title: 'รางวัล OTOP 5 ดาว', year: '2566', org: 'กรมพัฒนาชุมชน', desc: 'ได้รับการรับรองระดับ 5 ดาว สินค้า OTOP ระดับประเทศ' },
  { icon: '🌟', title: 'Best Thai Product Award', year: '2565', org: 'BOI Thailand', desc: 'รางวัลสินค้าไทยยอดเยี่ยมจากสำนักงานส่งเสริมการลงทุน' },
  { icon: '🎖️', title: 'Prime Minister Export Award', year: '2564', org: 'DITP', desc: 'รางวัลส่งออกยอดเยี่ยมจากกรมส่งเสริมการค้าระหว่างประเทศ' },
  { icon: '✅', title: 'GMP Certified', year: '2550', org: 'อย. ประเทศไทย', desc: 'มาตรฐานการผลิตที่ดี (Good Manufacturing Practice)' },
  { icon: '🕌', title: 'HALAL Certified', year: '2560', org: 'CICOT Thailand', desc: 'ได้รับการรับรองฮาลาลจากคณะกรรมการกลางอิสลาม' },
  { icon: '🌍', title: 'ISO 9001:2015', year: '2562', org: 'TÜV Rheinland', desc: 'ระบบบริหารคุณภาพตามมาตรฐานสากล ISO 9001' },
]

export default function AwardsPage() {
  return (
    <main>
      <Navbar />

      <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            รางวัล &<span className="text-herb-gold-300"> การรับรอง</span>
          </h1>
          <p className="text-white/80 font-display text-lg">
            ความสำเร็จที่เป็นเครื่องยืนยันคุณภาพของเรา
          </p>
        </div>
      </section>

      <section className="py-20 bg-herb-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AWARDS.map((award) => (
              <div
                key={award.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{award.icon}</div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display font-bold text-herb-dark text-base leading-tight flex-1 mr-2">
                    {award.title}
                  </h3>
                  <span className="bg-herb-green-50 text-herb-green-700 font-display font-bold text-xs px-2.5 py-1 rounded-full flex-shrink-0">
                    {award.year}
                  </span>
                </div>
                <p className="text-herb-green-600 font-display font-semibold text-xs mb-2">{award.org}</p>
                <p className="text-gray-500 text-sm font-display leading-relaxed">{award.desc}</p>
              </div>
            ))}
          </div>

          {/* Certification logos area */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <h2 className="font-display font-bold text-2xl text-herb-dark mb-2">
              มาตรฐานที่ได้รับการรับรอง
            </h2>
            <p className="text-gray-500 font-display mb-8">
              ทุกผลิตภัณฑ์ผ่านการตรวจสอบและได้รับการรับรองมาตรฐานระดับสากล
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['GMP', 'HALAL', 'อย.', 'ISO 9001', 'OTOP 5★', 'BOI'].map((cert) => (
                <div
                  key={cert}
                  className="w-24 h-24 bg-gradient-to-br from-herb-green-50 to-herb-green-100 border-2 border-herb-green-200 rounded-2xl flex items-center justify-center"
                >
                  <span className="font-display font-black text-herb-green-700 text-sm text-center leading-tight px-2">
                    {cert}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
