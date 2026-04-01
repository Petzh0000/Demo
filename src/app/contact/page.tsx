import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ติดต่อเรา | สมุนไพรไทย',
}

export default function ContactPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700 relative overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            ติดต่อ<span className="text-herb-gold-300">เรา</span>
          </h1>
          <p className="text-white/80 font-display text-lg">
            พร้อมให้บริการและตอบทุกคำถามของท่าน
          </p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-16 bg-herb-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info cards */}
            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  title: 'ที่อยู่',
                  lines: ['99/55 หมู่ที่ 7 ต.ไร่ขิง', 'อ.สามพราน จ.นครปฐม 73210'],
                  color: 'text-herb-green-600',
                  bg: 'bg-herb-green-50',
                },
                {
                  icon: Phone,
                  title: 'โทรศัพท์',
                  lines: ['034-318922', '085-700-5525'],
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                },
                {
                  icon: Mail,
                  title: 'อีเมล',
                  lines: ['info@thaiherb.co.th', 'sales@thaiherb.co.th'],
                  color: 'text-purple-600',
                  bg: 'bg-purple-50',
                },
                {
                  icon: Clock,
                  title: 'เวลาทำการ',
                  lines: ['จันทร์–ศุกร์: 8:00–17:00', 'เสาร์: 8:00–12:00'],
                  color: 'text-amber-600',
                  bg: 'bg-amber-50',
                },
              ].map(({ icon: Icon, title, lines, color, bg }) => (
                <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                  <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-herb-dark text-sm mb-1">{title}</h3>
                    {lines.map((l) => (
                      <p key={l} className="text-gray-500 text-sm font-display">{l}</p>
                    ))}
                  </div>
                </div>
              ))}

              {/* Social */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-display font-bold text-herb-dark text-sm mb-3">โซเชียลมีเดีย</h3>
                <div className="flex gap-3">
                  <a href="#" className="flex items-center gap-2 bg-[#1877F2] text-white font-display font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </a>
                  <a href="#" className="flex items-center gap-2 bg-[#06C755] text-white font-display font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                    <MessageCircle className="w-4 h-4" />
                    LINE
                  </a>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="font-display font-bold text-2xl text-herb-dark mb-6">
                ส่งข้อความถึงเรา
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                    ชื่อ-นามสกุล *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 transition-all"
                    placeholder="กรอกชื่อของท่าน"
                  />
                </div>
                <div>
                  <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                    เบอร์โทรศัพท์ *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 transition-all"
                    placeholder="0XX-XXX-XXXX"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                  อีเมล *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 transition-all"
                  placeholder="example@email.com"
                />
              </div>

              <div className="mb-4">
                <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                  หัวข้อ
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 transition-all bg-white text-gray-600">
                  <option>เลือกหัวข้อ</option>
                  <option>สอบถามเรื่องสินค้า</option>
                  <option>สั่งซื้อจำนวนมาก (Wholesale)</option>
                  <option>ตัวแทนจำหน่าย</option>
                  <option>แจ้งปัญหาการใช้งาน</option>
                  <option>อื่นๆ</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
                  ข้อความ *
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 transition-all resize-none"
                  placeholder="พิมพ์ข้อความของท่านที่นี่..."
                />
              </div>

              <button className="w-full bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold py-4 rounded-xl transition-all hover:shadow-lg active:scale-[0.99]">
                ส่งข้อความ
              </button>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-herb-green-600 mx-auto mb-3" />
              <p className="font-display font-bold text-herb-dark mb-1">99/55 หมู่ที่ 7 ต.ไร่ขิง</p>
              <p className="text-gray-500 font-display text-sm">อ.สามพราน จ.นครปฐม 73210</p>
              <a
                href="https://maps.google.com"
                target="_blank"
                className="mt-3 inline-block bg-herb-green-700 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-herb-green-800 transition-colors"
              >
                เปิด Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
