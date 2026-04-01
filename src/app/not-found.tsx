import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen bg-herb-cream flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">🌿</div>
          <h1 className="font-display font-black text-7xl text-herb-green-200 mb-2">404</h1>
          <h2 className="font-display font-extrabold text-2xl text-herb-dark mb-4">
            ไม่พบหน้าที่คุณต้องการ
          </h2>
          <p className="text-gray-500 font-display mb-8 max-w-sm mx-auto">
            หน้าที่คุณกำลังมองหาอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่จริง
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold px-8 py-4 rounded-full transition-all hover:shadow-lg"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </main>
  )
}
