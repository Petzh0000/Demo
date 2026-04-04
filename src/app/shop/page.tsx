'use client'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { Star, Search, Loader2, CheckCircle, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface Product {
  _id: string; name: string; nameEn?: string; description: string
  price: number; imageUrl: string; category: string
  badge?: string; tag?: string; inStock: boolean
}

const GROUPS = [
  { id: 'all', label: 'ทั้งหมด', icon: '🌿' },
  { id: 'massage', label: 'ยาสำหรับนวด', icon: '💆' },
  { id: 'inhale',  label: 'ยาสำหรับดม',  icon: '🌬️' },
  { id: 'gift',    label: 'ของชำร่วย',   icon: '🎁' },
]

const BADGE_STYLES: Record<string, string> = {
  bestseller: 'bg-herb-green-600 text-white',
  popular:    'bg-herb-gold-500 text-white',
  new:        'bg-red-500 text-white',
  premium:    'bg-purple-600 text-white',
}
const BADGE_LABELS: Record<string, string> = {
  bestseller: '🔥 ขายดี', popular: '⭐ ยอดนิยม', new: '✨ ใหม่', premium: '👑 พรีเมียม',
}

// ── Quantity Selector ──
function QtySelector({ inStock, onAdd }: { inStock: boolean; onAdd: (qty: number) => void }) {
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    if (!inStock) return
    onAdd(qty)
    setAdded(true)
    setTimeout(() => { setAdded(false); setQty(1) }, 1500)
  }

  if (!inStock) return <span className="text-xs font-display font-semibold text-gray-400 bg-gray-100 px-3 py-2 rounded-lg">หมด</span>

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-herb-green-50 hover:text-herb-green-700 transition-colors">
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-7 text-center font-display font-bold text-herb-dark text-sm">{qty}</span>
        <button onClick={() => setQty(q => Math.min(99, q + 1))} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-herb-green-50 hover:text-herb-green-700 transition-colors">
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <button onClick={handleAdd}
        className={`flex items-center gap-1 text-xs font-display font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
          added ? 'bg-herb-green-100 text-herb-green-700 scale-95' : 'bg-herb-green-700 hover:bg-herb-green-800 text-white active:scale-95'
        }`}
      >
        {added ? <><CheckCircle className="w-3 h-3" />เพิ่มแล้ว!</> : <><ShoppingCart className="w-3 h-3" />เพิ่ม</>}
      </button>
    </div>
  )
}

export default function ShopPage() {
  const { addItem, updateQty, items } = useCart()
  const [products, setProducts]       = useState<Product[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [activeGroup, setActiveGroup] = useState('all')

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (d.success) setProducts(d.products) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = products
    if (activeGroup !== 'all') list = list.filter(p => p.category === activeGroup)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.nameEn || '').toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [products, activeGroup, search])

  const handleAdd = (product: Product, qty: number) => {
    const existing = items.find(i => i._id === product._id)
    if (existing) {
      updateQty(product._id, existing.quantity + qty)
    } else {
      for (let i = 0; i < qty; i++) {
        addItem({ _id: product._id, name: product.name, nameEn: product.nameEn, price: product.price, imageUrl: product.imageUrl })
      }
    }
  }

  return (
    <main>
      <Navbar />

      <section className="pt-28 pb-12 bg-gradient-to-br from-herb-green-900 to-herb-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 text-[200px] flex items-center justify-end pr-16 select-none pointer-events-none">🌿</div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white mb-4">
            ผลิตภัณฑ์<span className="text-herb-gold-300">สมุนไพรไทย</span>
          </h1>
          <p className="text-white/80 font-display text-lg max-w-xl mx-auto">
            คัดสรรสมุนไพรไทยคุณภาพสูง ผ่านกรรมวิธีการผลิตมาตรฐาน GMP
          </p>
        </div>
      </section>

      <section className="py-12 bg-herb-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="ค้นหาสินค้า..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {GROUPS.map(g => (
                <button key={g.id} onClick={() => setActiveGroup(g.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-display font-medium text-sm transition-all ${
                    activeGroup === g.id ? 'bg-herb-green-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-herb-green-400 hover:text-herb-green-700'
                  }`}
                >
                  <span>{g.icon}</span>{g.label}
                </button>
              ))}
            </div>
          </div>

          {!loading && (
            <p className="text-gray-500 font-display text-sm mb-6">
              แสดง <span className="font-bold text-herb-green-700">{filtered.length}</span> รายการ
              {search && ` สำหรับ "${search}"`}
            </p>
          )}

          {loading ? (
            <div className="flex flex-col items-center py-24">
              <Loader2 className="w-10 h-10 text-herb-green-600 animate-spin mb-3" />
              <p className="font-display text-gray-400">กำลังโหลดสินค้า...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <p className="font-display font-bold text-gray-400 text-xl">ไม่พบสินค้า</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(product => (
                <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 group">
                  {/* Image */}
                  <div className="relative h-44 bg-herb-green-50 overflow-hidden">
                    {product.badge && BADGE_LABELS[product.badge] && (
                      <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-display font-bold z-10 ${BADGE_STYLES[product.badge]}`}>
                        {BADGE_LABELS[product.badge]}
                      </div>
                    )}
                    {product.imageUrl ? (
                      <Image src={product.imageUrl} alt={product.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">📦</div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-gray-700 text-white font-display font-bold text-xs px-3 py-1.5 rounded-full">สินค้าหมด</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-display font-bold text-herb-dark text-sm leading-snug mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                    <p className="text-gray-400 text-xs font-display mb-2 line-clamp-1">{product.description}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-black text-herb-green-700 text-lg whitespace-nowrap">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <QtySelector inStock={product.inStock} onAdd={qty => handleAdd(product, qty)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
