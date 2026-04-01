import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'วิสัยทัศน์ | สมุนไพรไทย',
}

const VALUES = [
  { icon: '🌿', title: 'ธรรมชาติ', desc: 'ใช้สมุนไพรไทยแท้จากธรรมชาติ 100% ไม่มีสารเคมีอันตราย' },
  { icon: '🔬', title: 'วิจัยและพัฒนา', desc: 'ลงทุนในการวิจัยเพื่อพัฒนาสูตรใหม่ที่มีประสิทธิภาพสูงขึ้น' },
  { icon: '🌍', title: 'ระดับโลก', desc: 'มุ่งสู่การเป็น Thai Herb Brand ระดับโลกที่คนทั่วโลกรู้จัก' },
  { icon: '💚', title: 'รับผิดชอบต่อสังคม', desc: 'ใส่ใจสิ่งแวดล้อมและสนับสนุนเกษตรกรผู้ปลูกสมุนไพรไทย' },
]

export default function VisionPage() {
  return (
    <main>
      <Navbar />

      <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            วิสัย<span className="text-herb-gold-300">ทัศน์</span>
          </h1>
          <p className="text-white/80 font-display text-lg">
            ทิศทางและเป้าหมายของสมุนไพรไทยในอนาคต
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Vision statement */}
          <div className="bg-gradient-to-br from-herb-green-50 to-herb-green-100 border border-herb-green-200 rounded-3xl p-10 text-center mb-16">
            <div className="text-5xl mb-5">🌿</div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-herb-green-800 mb-5 leading-relaxed">
              "มุ่งมั่นเป็น Thai Herb Brand ระดับโลก<br />ที่ผสมผสานภูมิปัญญาไทยกับมาตรฐานสากล"
            </h2>
            <p className="text-herb-green-700 font-display max-w-2xl mx-auto leading-relaxed">
              เราเชื่อว่าสมุนไพรไทยมีคุณค่าระดับโลก และพันธกิจของเราคือการนำความดีงามของสมุนไพรไทย
              ไปสู่ผู้คนทั่วทุกมุมโลก ด้วยคุณภาพและมาตรฐานที่เชื่อถือได้
            </p>
          </div>

          {/* Mission */}
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl text-herb-dark mb-4">
              พันธกิจ
            </h2>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 bg-herb-green-300" />
              <span className="text-herb-green-600 text-xl">🎯</span>
              <div className="h-px w-16 bg-herb-green-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {[
              'ผลิตสินค้าสมุนไพรคุณภาพสูงตามมาตรฐานสากล',
              'อนุรักษ์และเผยแพร่ภูมิปัญญาสมุนไพรไทยสู่โลก',
              'วิจัยและพัฒนาผลิตภัณฑ์ใหม่อย่างต่อเนื่อง',
              'สร้างความไว้วางใจให้ลูกค้าทั่วโลก',
            ].map((m, i) => (
              <div key={i} className="flex items-start gap-4 bg-herb-cream rounded-2xl p-5">
                <div className="w-8 h-8 bg-herb-green-700 text-white rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <p className="font-display text-gray-700 leading-relaxed">{m}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="text-center mb-10">
            <h2 className="font-display font-extrabold text-3xl text-herb-dark">ค่านิยมองค์กร</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white border border-herb-green-100 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-display font-bold text-herb-dark mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm font-display leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
