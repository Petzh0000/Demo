import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'นโยบายความเป็นส่วนตัว | สมุนไพรไทย',
}

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-extrabold text-4xl text-white mb-4">
            นโยบาย<span className="text-herb-gold-300">ความเป็นส่วนตัว</span>
          </h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm max-w-none">
          <div className="bg-herb-green-50 border border-herb-green-100 rounded-2xl p-6 mb-8">
            <p className="font-display text-herb-green-800 font-medium">
              อัพเดทล่าสุด: 1 มกราคม 2567
            </p>
          </div>

          {[
            { title: '1. ข้อมูลที่เราเก็บรวบรวม', content: 'เราเก็บรวบรวมข้อมูลส่วนบุคคลที่คุณให้ไว้โดยตรง เช่น ชื่อ ที่อยู่อีเมล หมายเลขโทรศัพท์ ที่อยู่สำหรับจัดส่ง และข้อมูลการชำระเงิน' },
            { title: '2. วิธีใช้ข้อมูล', content: 'เราใช้ข้อมูลส่วนบุคคลของคุณเพื่อประมวลผลคำสั่งซื้อ ส่งมอบสินค้า ติดต่อสื่อสารเรื่องคำสั่งซื้อ และส่งข้อมูลโปรโมชั่นที่คุณอาจสนใจ' },
            { title: '3. การรักษาความปลอดภัย', content: 'เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลส่วนบุคคลของคุณจากการเข้าถึง การใช้ หรือการเปิดเผยโดยไม่ได้รับอนุญาต' },
            { title: '4. การเปิดเผยข้อมูล', content: 'เราไม่ขาย ไม่แลกเปลี่ยน หรือไม่โอนข้อมูลส่วนบุคคลของคุณไปยังบุคคลภายนอก ยกเว้นกรณีที่จำเป็นสำหรับการให้บริการ เช่น บริษัทขนส่ง' },
            { title: '5. สิทธิของคุณ', content: 'คุณมีสิทธิ์ขอดู แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ทุกเมื่อ โดยติดต่อมาที่อีเมล info@thaiherb.co.th' },
          ].map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="font-display font-bold text-xl text-herb-dark mb-3">{section.title}</h2>
              <p className="font-display text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
