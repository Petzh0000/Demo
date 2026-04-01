'use client'
/**
 * 📁 src/components/ui/CartDrawer.tsx
 * -------------------------------------------------------
 * ตะกร้าสินค้าแบบ Slide-in Drawer จากทางขวา
 *
 * 📌 แสดงเมื่อ: กดปุ่ม Cart icon บน Navbar
 * 📌 ฟีเจอร์:
 *   - แสดงรายการสินค้า + รูป + ราคา
 *   - เพิ่ม/ลด จำนวน
 *   - ลบสินค้าออก
 *   - แสดงยอดรวม
 *   - ปุ่ม "ดำเนินการชำระเงิน" → ไป /checkout
 * -------------------------------------------------------
 */

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, PackageOpen } from 'lucide-react'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, itemCount, total } = useCart()

  const SHIPPING_FEE = 50
  const FREE_SHIPPING_THRESHOLD = 500

  const isShippingFree = total >= FREE_SHIPPING_THRESHOLD
  const grandTotal = total + (isShippingFree ? 0 : SHIPPING_FEE)

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-herb-green-700" />
            <span className="font-display font-bold text-herb-dark text-lg">ตะกร้าสินค้า</span>
            {itemCount > 0 && (
              <span className="bg-herb-green-700 text-white text-xs font-display font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            // Empty cart
            <div className="flex flex-col items-center justify-center h-full text-center">
              <PackageOpen className="w-14 h-14 text-gray-200 mb-4" />
              <p className="font-display font-bold text-gray-400 text-lg mb-1">ตะกร้าว่างเปล่า</p>
              <p className="font-display text-gray-300 text-sm mb-6">เพิ่มสินค้าที่ต้องการก่อนนะคะ</p>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-herb-green-700 text-white font-display font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-herb-green-800 transition-colors"
              >
                เลือกสินค้า
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Free shipping banner */}
              {!isShippingFree && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center">
                  <p className="font-display text-amber-700 text-xs">
                    🚚 ซื้ออีก <span className="font-bold">฿{(FREE_SHIPPING_THRESHOLD - total).toLocaleString()}</span> รับส่งฟรี!
                  </p>
                  <div className="mt-1.5 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {isShippingFree && (
                <div className="bg-herb-green-50 border border-herb-green-200 rounded-xl px-4 py-3 text-center">
                  <p className="font-display text-herb-green-700 text-xs font-semibold">🎉 ได้รับส่งฟรี!</p>
                </div>
              )}

              {/* Cart items */}
              {items.map((item) => (
                <div key={item._id} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-herb-green-50 flex-shrink-0">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} width={56} height={56} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-herb-dark text-sm leading-tight line-clamp-2">{item.name}</p>
                    <p className="font-display font-bold text-herb-green-700 text-sm mt-1">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="font-display text-gray-400 text-xs">฿{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>

                  {/* Qty control */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQty(item._id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-herb-green-400 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="font-display font-bold text-herb-dark text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item._id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-herb-green-700 flex items-center justify-center hover:bg-herb-green-800 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — Summary + Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 bg-white">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between font-display text-sm text-gray-600">
                <span>ยอดสินค้า ({itemCount} ชิ้น)</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-display text-sm text-gray-600">
                <span>ค่าจัดส่ง</span>
                <span className={isShippingFree ? 'text-herb-green-600 font-semibold' : ''}>
                  {isShippingFree ? 'ฟรี!' : `฿${SHIPPING_FEE}`}
                </span>
              </div>
              <div className="flex justify-between font-display font-black text-herb-dark text-base pt-2 border-t border-gray-100">
                <span>รวมทั้งสิ้น</span>
                <span className="text-herb-green-700">฿{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold py-3.5 rounded-xl transition-all hover:shadow-lg"
            >
              ดำเนินการชำระเงิน
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
