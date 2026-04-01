import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา | สมุนไพรไทย',
  description: 'ประวัติและความเป็นมาของสมุนไพรไทย กว่า 30 ปีแห่งคุณภาพและความไว้วางใจ',
}

const TIMELINE = [
  { year: '2537', title: 'ก่อตั้งบริษัท', desc: 'เริ่มผลิตยาหม่องสมุนไพรไทยจากภูมิปัญญาท้องถิ่น' },
  { year: '2540', title: 'ได้รับใบอนุญาต อย.', desc: 'ได้รับการรับรองจากสำนักงานคณะกรรมการอาหารและยา' },
  { year: '2545', title: 'ขยายตลาดทั่วไทย', desc: 'วางจำหน่ายในร้านขายยาและห้างสรรพสินค้าทั่วประเทศ' },
  { year: '2550', title: 'ได้รับมาตรฐาน GMP', desc: 'ยกระดับมาตรฐานการผลิตสู่ระดับสากล' },
  { year: '2555', title: 'ขยายสู่ตลาดต่างประเทศ', desc: 'ส่งออกสินค้าสู่กว่า 20 ประเทศทั่วโลก' },
  { year: '2560', title: 'ได้รับมาตรฐาน HALAL', desc: 'รองรับตลาดมุสลิมทั่วโลก' },
  { year: '2567', title: 'ครบรอบ 30 ปี', desc: 'ส่งออกสู่กว่า 50 ประเทศ มีลูกค้ากว่า 1 ล้านคน' },
]

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-herb-green-900 to-herb-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[250px] flex items-center justify-center select-none pointer-events-none">
          🌿
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white/90 font-display text-sm px-4 py-2 rounded-full mb-5">
            เกี่ยวกับเรา
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-5 leading-tight">
            30 ปีแห่ง<span className="text-herb-gold-300">ภูมิปัญญาไทย</span>
          </h1>
          <p className="text-white/80 font-display text-lg leading-relaxed max-w-2xl mx-auto">
            จากการผสมผสานภูมิปัญญาชาวบ้านกับสมุนไพรไทยอันทรงคุณค่า
            สู่ผลิตภัณฑ์ที่เป็นที่รักใคร่ของคนทั่วโลก
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block bg-herb-green-50 text-herb-green-700 font-display font-semibold text-sm px-4 py-2 rounded-full mb-5">
                ความเป็นมา
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-herb-dark mb-6 leading-tight">
                จากรากเหง้า<br />สู่ระดับโลก
              </h2>
              <div className="space-y-4 text-gray-600 font-display leading-relaxed">
                <p>
                  เรามีความเชื่อว่าธรรมชาติได้มอบสิ่งดีที่สุดให้แก่มนุษย์ผ่านพืชสมุนไพรนานาชนิด
                  ด้วยภูมิปัญญาของบรรพบุรุษไทยที่สืบทอดกันมาหลายร้อยปี
                </p>
                <p>
                  เราจึงได้นำความรู้เหล่านั้นมาพัฒนาต่อยอด ผ่านกระบวนการวิจัยและพัฒนาอย่างเป็นระบบ
                  เพื่อให้ได้ผลิตภัณฑ์ที่มีคุณภาพและประสิทธิภาพสูงสุด
                </p>
                <p>
                  วันนี้ผลิตภัณฑ์สมุนไพรไทยของเราเป็นที่ยอมรับและนิยมใช้กันอย่างแพร่หลาย
                  ทั้งในประเทศและต่างประเทศกว่า 50 ประเทศทั่วโลก
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: '30+', lbl: 'ปีแห่งประสบการณ์', icon: '📅', color: 'from-herb-green-50 to-herb-green-100 border-herb-green-200' },
                { val: '50+', lbl: 'ประเทศที่ส่งออก', icon: '🌍', color: 'from-blue-50 to-blue-100 border-blue-200' },
                { val: '10+', lbl: 'ผลิตภัณฑ์หลัก', icon: '📦', color: 'from-herb-gold-100 to-amber-100 border-amber-200' },
                { val: '1M+', lbl: 'ลูกค้าทั่วโลก', icon: '👥', color: 'from-purple-50 to-purple-100 border-purple-200' },
              ].map((s) => (
                <div key={s.lbl} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-6 text-center`}>
                  <div className="text-4xl mb-3">{s.icon}</div>
                  <div className="font-display font-black text-3xl text-herb-dark mb-1">{s.val}</div>
                  <div className="text-gray-500 text-sm font-display">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-herb-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-herb-dark mb-4">
              เส้นทาง<span className="text-gradient">ของเรา</span>
            </h2>
          </div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-herb-green-200 -translate-x-1/2" />

            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.year}
                  className={`flex items-center gap-6 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block bg-white border border-herb-green-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow ${i % 2 === 0 ? 'ml-auto' : ''}`}>
                      <div className="font-display font-black text-herb-green-700 text-lg mb-1">{item.title}</div>
                      <div className="text-gray-500 text-sm font-display">{item.desc}</div>
                    </div>
                  </div>

                  {/* Year bubble */}
                  <div className="w-16 h-16 bg-herb-green-700 text-white rounded-full flex items-center justify-center font-display font-bold text-xs text-center flex-shrink-0 z-10 shadow-lg">
                    {item.year}
                  </div>

                  <div className="flex-1" />
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
