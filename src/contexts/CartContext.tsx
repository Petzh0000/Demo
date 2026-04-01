'use client'
/**
 * 📁 src/contexts/CartContext.tsx
 * -------------------------------------------------------
 * Global State สำหรับตะกร้าสินค้า (Cart)
 *
 * 📌 วิธีใช้ในหน้าอื่น:
 *   import { useCart } from '@/contexts/CartContext'
 *   const { items, addItem, removeItem, total } = useCart()
 *
 * 📌 ฟังก์ชัน:
 *   addItem(product)    → เพิ่มสินค้า (ถ้ามีแล้ว → qty+1)
 *   removeItem(id)      → ลบสินค้าออกจากตะกร้า
 *   updateQty(id, qty)  → เปลี่ยนจำนวน
 *   clearCart()         → ล้างตะกร้า
 *   itemCount           → จำนวนชิ้นรวม (แสดงบน icon)
 *   total               → ยอดรวม (บาท)
 *   isOpen / setIsOpen  → เปิด/ปิด Cart Drawer
 *
 * 📌 Cart บันทึกใน localStorage
 *   → ปิด browser แล้วกลับมา ยังมีสินค้าอยู่
 * -------------------------------------------------------
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  _id: string
  name: string
  nameEn?: string
  price: number
  imageUrl: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | null>(null)

const CART_KEY = 'herb_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // โหลด cart จาก localStorage เมื่อ mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) setItems(JSON.parse(saved))
    } catch { /* ignore */ }
    setMounted(true)
  }, [])

  // บันทึก cart ลง localStorage ทุกครั้งที่ items เปลี่ยน
  useEffect(() => {
    if (mounted) localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, mounted])

  // เพิ่มสินค้าลงตะกร้า
  const addItem = (product: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) {
        // มีแล้ว → เพิ่ม qty
        return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsOpen(true) // เปิด drawer อัตโนมัติ
  }

  // ลบสินค้าออก
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i._id !== id))

  // เปลี่ยนจำนวน
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return }
    setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: qty } : i))
  }

  // ล้างตะกร้า
  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateQty, clearCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart ต้องใช้ภายใน CartProvider')
  return ctx
}
