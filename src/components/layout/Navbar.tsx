'use client'
/**
 * 📁 src/components/layout/Navbar.tsx
 *
 * 📌 เปลี่ยนโลโก้:
 *   วางไฟล์รูปที่ /public/images/logo.png
 *   ถ้าไม่มีรูปจะแสดงไอคอน Leaf แทน
 *
 * 📌 เพิ่ม/แก้เมนู:
 *   แก้ใน NAV_ITEMS array ด้านล่าง
 *
 * 📌 แก้ชื่อแบรนด์:
 *   แก้ BRAND_NAME และ BRAND_NAME_EN
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ShoppingCart, Leaf } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

// ── ตั้งค่าโลโก้และชื่อแบรนด์ ──
const LOGO_IMAGE   = '/images/logo.jpg'   // วางรูปที่ /public/images/logo.png
const BRAND_NAME   = 'กรรณณิการ์'
const BRAND_NAME_EN = 'Kannika'

const NAV_ITEMS = [
  { label: 'หน้าแรก', href: '/' },
  {
    label: 'เกี่ยวกับเรา', href: '/about',
    children: [
      { label: 'ความเป็นมา',          href: '/about' },
      { label: 'วิสัยทัศน์',          href: '/vision' },
      { label: 'รางวัลรับรองคุณภาพ', href: '/awards' },
    ],
  },
  {
    label: 'สาระพัน', href: '/news',
    children: [
      { label: 'ข่าวสาร', href: '/news' },
      { label: 'บทความ',  href: '/blog' },
    ],
  },
  { label: 'ผลิตภัณฑ์',    href: '/shop' },
  { label: 'วิธีชำระเงิน', href: '/payment' },
  { label: 'ติดต่อเรา',    href: '/contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen]               = useState(false)
  const [scrolled, setScrolled]           = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [logoError, setLogoError]         = useState(false)
  const { itemCount, setIsOpen: openCart } = useCart()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ปิด dropdown เมื่อ click นอก
  useEffect(() => {
    if (!activeDropdown) return
    const handler = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setActiveDropdown(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [activeDropdown])

  const toggle = (label: string) =>
    setActiveDropdown(prev => (prev === label ? null : label))

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      {/* Announcement bar */}
      <div className="bg-herb-green-700 text-white text-center py-1.5 text-xs font-display tracking-wide">
        🌿 ยาหม่องสมุนไพรไทยที่คนทั่วโลกวางใจ — ได้มาตรฐาน GMP &amp; HALAL 🌿
      </div>

      <div ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo (static) ── */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            {logoError ? (
              <div className="w-10 h-10 bg-herb-green-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Leaf className="text-white w-5 h-5" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform bg-herb-green-50">
                <Image
                  src={LOGO_IMAGE}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={() => setLogoError(true)}
                />
              </div>
            )}
            <div>
              <div className="font-display font-bold text-herb-green-800 text-sm leading-tight">
                {BRAND_NAME}
              </div>
              <div className="text-herb-gold-500 text-[10px] font-medium tracking-widest uppercase">
                {BRAND_NAME_EN}
              </div>
            </div>
          </Link>

          {/* ── Desktop nav — click-based dropdown ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggle(item.label)}
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all font-display ${
                        activeDropdown === item.label
                          ? 'text-herb-green-700 bg-herb-green-50'
                          : 'text-gray-700 hover:text-herb-green-700 hover:bg-herb-green-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          activeDropdown === item.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {activeDropdown === item.label && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-herb-green-100 overflow-hidden z-50">
                        {item.children.map(child => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-3 text-sm text-gray-600 hover:text-herb-green-700 hover:bg-herb-green-50 font-display transition-colors border-b border-gray-50 last:border-0"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-herb-green-700 rounded-lg hover:bg-herb-green-50 transition-all font-display"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* ── Cart + CTA ── */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => openCart(true)}
              className="relative p-2 text-gray-600 hover:text-herb-green-700 transition-colors"
              aria-label="ตะกร้าสินค้า"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-herb-green-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
            <Link
              href="/shop"
              className="bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              สั่งซื้อเลย
            </Link>
          </div>

          {/* ── Mobile ── */}
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

      {/* ── Mobile menu ── */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-herb-green-100 px-4 py-4 shadow-lg">
          {NAV_ITEMS.map(item => (
            <div key={item.label}>
              <Link
                href={item.children ? '#' : item.href}
                className="block py-3 text-gray-700 font-display font-medium border-b border-gray-100"
                onClick={() => { if (!item.children) setIsOpen(false) }}
              >
                {item.label}
              </Link>
              {item.children?.map(child => (
                <Link
                  key={child.label}
                  href={child.href}
                  className="block py-2 pl-4 text-sm text-gray-500 font-display hover:text-herb-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  — {child.label}
                </Link>
              ))}
            </div>
          ))}
          <Link
            href="/shop"
            className="mt-4 block text-center bg-herb-green-700 text-white font-display font-semibold py-3 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            สั่งซื้อเลย
          </Link>
        </div>
      )}
    </nav>
  )
}
