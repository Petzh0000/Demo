'use client'
/**
 * 📁 src/components/layout/Navbar.tsx
 * -------------------------------------------------------
 * Navbar พร้อม Cart Icon ที่แสดงจำนวนสินค้าในตะกร้า
 *
 * 📌 วิธีเพิ่มเมนูใหม่:
 *   ค้นหา NAV_ITEMS array แล้วเพิ่ม object
 *
 * 📌 วิธีเปลี่ยนข้อความ Announcement bar:
 *   ค้นหา bg-herb-green-700 ด้านบนสุด
 * -------------------------------------------------------
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, ShoppingCart, Leaf } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const NAV_ITEMS = [
  { label: 'หน้าแรก', href: '/' },
  {
    label: 'เกี่ยวกับเรา', href: '#about',
    children: [
      { label: 'ความเป็นมา', href: '/about' },
      { label: 'วิสัยทัศน์', href: '/vision' },
      { label: 'รางวัลรับรองคุณภาพ', href: '/awards' },
    ],
  },
  {
    label: 'สาระพัน', href: '#info',
    children: [
      { label: 'ข่าวสาร', href: '/news' },
      { label: 'บทความ', href: '/blog' },
    ],
  },
  { label: 'ผลิตภัณฑ์', href: '/shop' },
  { label: 'ติดต่อเรา', href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { itemCount, setIsOpen: openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/97 shadow-md backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
      {/* Announcement bar */}
      <div className="bg-herb-green-700 text-white text-center py-1.5 text-xs font-display tracking-wide">
        🌿 ยาหม่องสมุนไพรไทยที่คนทั่วโลกวางใจ — ได้มาตรฐาน GMP & HALAL 🌿
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-herb-green-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-herb-green-800 text-sm leading-tight">สมุนไพรไทย</div>
              <div className="text-herb-gold-500 text-[10px] font-medium tracking-widest uppercase">Thai Herb</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link href={item.href} className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-herb-green-700 rounded-lg hover:bg-herb-green-50 transition-all font-display">
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-herb-green-100 overflow-hidden z-50">
                    {item.children.map((child) => (
                      <Link key={child.label} href={child.href} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-herb-green-700 hover:bg-herb-green-50 font-display transition-colors">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cart + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Cart icon with badge */}
            <button
              onClick={() => openCart(true)}
              className="relative p-2 text-gray-600 hover:text-herb-green-700 transition-colors"
              aria-label="ตะกร้าสินค้า"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-herb-green-600 text-white text-[10px] font-display font-bold rounded-full flex items-center justify-center animate-pulse">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
            <Link href="/shop" className="bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
              สั่งซื้อเลย
            </Link>
          </div>

          {/* Mobile: cart + menu */}
          <div className="lg:hidden flex items-center gap-2">
            <button onClick={() => openCart(true)} className="relative p-2 text-gray-700">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-herb-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-700" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-herb-green-100 px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              <Link href={item.href} className="block py-3 text-gray-700 font-display font-medium border-b border-gray-100 last:border-0" onClick={() => setIsOpen(false)}>
                {item.label}
              </Link>
              {item.children?.map((child) => (
                <Link key={child.label} href={child.href} className="block py-2 pl-4 text-sm text-gray-500 font-display" onClick={() => setIsOpen(false)}>
                  — {child.label}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/shop" className="mt-4 block text-center bg-herb-green-700 text-white font-display font-semibold py-3 rounded-full" onClick={() => setIsOpen(false)}>
            สั่งซื้อเลย
          </Link>
        </div>
      )}
    </nav>
  )
}
