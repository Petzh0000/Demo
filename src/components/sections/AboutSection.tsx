'use client'
import { FEATURES } from '@/lib/data'

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-herb-green-50 text-herb-green-700 font-display font-semibold text-sm px-4 py-2 rounded-full mb-4">
            เกี่ยวกับเรา
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-herb-dark mb-4">
            <span className="text-gradient">สมุนไพรไทย</span> ที่คนทั่วโลกวางใจ
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-herb-green-300" />
            <span className="text-herb-green-600 text-xl">🌿</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-herb-green-300" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto font-display leading-relaxed">
            ถึงวันนี้ 30 ปีแล้วที่เราได้คิดค้นนำสมุนไพรไทยมาผสมผสานกับภูมิปัญญาชาวบ้าน
            ผลิตเป็นยารักษาโรค จนเป็นที่รู้จักในฐานะต้นตำรับผู้ผลิตยาหม่องสมุนไพรอันดับหนึ่งของประเทศ
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Visual side */}
          <div className="relative">
            <div className="bg-gradient-to-br from-herb-green-50 to-herb-green-100 rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-herb-green-200/40 rounded-full" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-herb-gold-100 rounded-full" />

              <div className="relative text-center py-8">
                <div className="text-8xl mb-4 leaf-float">🌿</div>
                <div className="font-display font-black text-6xl text-herb-green-700 mb-2">30+</div>
                <div className="font-display text-herb-green-600 text-lg font-medium">ปีแห่งความไว้วางใจ</div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { val: '50+', lbl: 'ประเทศ', icon: '🌍' },
                  { val: '10+', lbl: 'ผลิตภัณฑ์', icon: '📦' },
                  { val: '1M+', lbl: 'ลูกค้า', icon: '👥' },
                ].map((s) => (
                  <div key={s.lbl} className="bg-white rounded-2xl p-3 text-center shadow-sm">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="font-display font-black text-herb-green-700 text-lg">{s.val}</div>
                    <div className="text-gray-500 text-xs font-display">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="text-gray-600 font-display leading-relaxed mb-6">
              ด้วยสรรพคุณที่หลากหลายทั้งบรรเทาอาการปวดเมื่อย, อาการคันจากแมลงสัตว์กัดต่อย,
              อาการออฟฟิศซินโดรม, ตลอดจนใช้สูดดมเพื่อแก้วิงเวียนหรือคัดจมูก
            </p>
            <p className="text-gray-600 font-display leading-relaxed mb-8">
              ด้วยคุณภาพเนื้อยาที่หอมเนียน กลิ่นอันเป็นเอกลักษณ์ และมาตรฐานการผลิตที่ดี
              จึงทำให้เป็นที่นิยมแก่ลูกค้าทั่วไปทุกวัยทุกสาขาอาชีพ
            </p>

            {/* Certification logos */}
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'GMP', color: 'bg-blue-50 border-blue-200 text-blue-700' },
                { label: 'HALAL', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'อย. ไทย', color: 'bg-red-50 border-red-200 text-red-700' },
                { label: 'ISO 9001', color: 'bg-purple-50 border-purple-200 text-purple-700' },
              ].map((cert) => (
                <div
                  key={cert.label}
                  className={`px-4 py-2 rounded-xl border font-display font-bold text-sm ${cert.color}`}
                >
                  {cert.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group bg-gradient-to-b from-white to-herb-green-50 border border-herb-green-100 rounded-2xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="font-display font-bold text-herb-dark text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm font-display leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
