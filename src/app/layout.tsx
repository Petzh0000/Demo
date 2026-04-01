import type { Metadata } from 'next'
import '@/styles/globals.css'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/ui/CartDrawer'

export const metadata: Metadata = {
  title: 'สมุนไพรไทย | ยาหม่องและน้ำมันนวดสมุนไพรไทยคุณภาพระดับโลก',
  description: 'ผลิตภัณฑ์สมุนไพรไทยคุณภาพสูง ยาหม่อง น้ำมันนวด จากภูมิปัญญาไทย ได้มาตรฐาน GMP และ HALAL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body suppressHydrationWarning>
        {/* CartProvider ครอบทุกหน้า → ทุก component ใช้ useCart() ได้ */}
        <CartProvider>
          {children}
          {/* CartDrawer อยู่นอก children เพื่อแสดงซ้อนบนทุกหน้า */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
