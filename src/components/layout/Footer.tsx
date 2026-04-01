import Link from 'next/link'
import { Leaf, Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-herb-dark text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-herb-green-600 rounded-full flex items-center justify-center">
                <Leaf className="text-white w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-bold text-herb-green-400 text-base">สมุนไพรไทย</div>
                <div className="text-herb-gold-300 text-[10px] tracking-widest">THAI HERB BRAND</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm font-display leading-relaxed mb-6">
              ยาหม่องและน้ำมันนวดสมุนไพรไทย <br />
              คุณภาพระดับโลก ที่คนทั่วโลกวางใจ <br />
              มากกว่า 30 ปี
            </p>
            {/* Certifications */}
            <div className="flex gap-2 flex-wrap">
              {['GMP', 'HALAL', 'อย.'].map((cert) => (
                <span
                  key={cert}
                  className="px-2.5 py-1 bg-herb-green-800 border border-herb-green-600 rounded-md text-herb-green-300 text-xs font-display font-semibold"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="font-display font-semibold text-herb-green-400 mb-4 text-sm uppercase tracking-wider">
              ข้อมูลบริษัท
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'ความเป็นมา', href: '/about' },
                { label: 'วิสัยทัศน์', href: '/vision' },
                { label: 'รางวัลรับรองคุณภาพ', href: '/awards' },
                { label: 'ข่าวสาร', href: '/news' },
                { label: 'บทความ', href: '/blog' },
                { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-herb-green-400 text-sm font-display transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-display font-semibold text-herb-green-400 mb-4 text-sm uppercase tracking-wider">
              ผลิตภัณฑ์
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'กลุ่มยาสำหรับนวด', href: '/shop/massage' },
                { label: 'กลุ่มยาสำหรับดม', href: '/shop/inhale' },
                { label: 'กลุ่มของชำร่วย', href: '/shop/gift' },
                { label: 'สินค้าทั้งหมด', href: '/shop' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-herb-green-400 text-sm font-display transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h3 className="font-display font-semibold text-herb-green-400 mb-3 text-sm uppercase tracking-wider">
                ช้อปปิ้ง
              </h3>
              <ul className="space-y-2.5">
                {[
                  { label: 'ตะกร้าสินค้า', href: '/cart' },
                  { label: 'วิธีการชำระเงิน', href: '/payment' },
                  { label: 'ติดต่อเรา', href: '/contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-gray-400 hover:text-herb-green-400 text-sm font-display transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-herb-green-400 mb-4 text-sm uppercase tracking-wider">
              ติดต่อเรา
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-herb-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm font-display leading-relaxed">
                  99/55 หมู่ที่ 7 ต.ไร่ขิง <br />
                  อ.สามพราน จ.นครปฐม 73210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-herb-green-500 flex-shrink-0" />
                <a href="tel:034318922" className="text-gray-400 hover:text-white text-sm font-display transition-colors">
                  034-318922
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-herb-green-500 flex-shrink-0" />
                <a href="mailto:info@thaiherb.co.th" className="text-gray-400 hover:text-white text-sm font-display transition-colors">
                  info@thaiherb.co.th
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="mt-6">
              <p className="text-gray-500 text-xs font-display mb-3">ติดตามเราได้ที่</p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, href: '#', color: 'hover:text-blue-400' },
                  { Icon: Youtube, href: '#', color: 'hover:text-red-400' },
                  { Icon: Instagram, href: '#', color: 'hover:text-pink-400' },
                ].map(({ Icon, href, color }, i) => (
                  <a
                    key={i}
                    href={href}
                    className={`w-9 h-9 bg-white/10 rounded-full flex items-center justify-center text-gray-400 ${color} hover:bg-white/20 transition-all`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs font-display">
            ©2024 Thai Herb Brand Co., Ltd. All Rights Reserved.
          </p>
          <p className="text-gray-600 text-xs font-display">
            Designed with 💚 by Senior Full Stack Dev
          </p>
        </div>
      </div>
    </footer>
  )
}
