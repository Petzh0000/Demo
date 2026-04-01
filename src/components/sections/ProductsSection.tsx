'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye, Star, Loader2, CheckCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

interface Product {
  _id: string
  name: string
  nameEn?: string
  description: string
  price: number
  imageUrl: string
  category: string
  badge?: string
  tag?: string
  inStock: boolean
}

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'massage', label: '💆 ยาสำหรับนวด' },
  { id: 'inhale', label: '🌬️ ยาสำหรับดม' },
  { id: 'gift', label: '🎁 ของชำร่วย' },
]

const BADGE_STYLES: Record<string, string> = {
  bestseller: 'bg-herb-green-600 text-white',
  popular: 'bg-herb-gold-500 text-white',
  new: 'bg-red-500 text-white',
  premium: 'bg-purple-600 text-white',
}
const BADGE_LABELS: Record<string, string> = {
  bestseller: '🔥 ขายดี',
  popular: '⭐ ยอดนิยม',
  new: '✨ ใหม่',
  premium: '👑 พรีเมียม',
}

export default function ProductsSection() {
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [addedId, setAddedId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { if (data.success) setProducts(data.products) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory)

  // ─── เพิ่มสินค้าลงตะกร้า + แสดง feedback ชั่วคราว ───
  const handleAddToCart = (product: Product) => {
    addItem({
      _id: product._id,
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      imageUrl: product.imageUrl,
    })
    setAddedId(product._id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <section id="products" className="py-20 bg-herb-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-herb-gold-100 text-herb-gold-700 font-display font-semibold text-sm px-4 py-2 rounded-full mb-4">
            ผลิตภัณฑ์ของเรา
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-herb-dark mb-4">
            ผลิตภัณฑ์ <span className="text-gradient">สมุนไพรไทย</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-herb-gold-300" />
            <span className="text-herb-gold-500 text-xl">🌻</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-herb-gold-300" />
          </div>
          <p className="text-gray-500 font-display max-w-xl mx-auto">
            คุณภาพที่ผ่านการรับรองมาตรฐาน GMP และ HALAL เพื่อความปลอดภัยของผู้บริโภค
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-display font-medium text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-herb-green-700 text-white shadow-md shadow-herb-green-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-herb-green-300 hover:text-herb-green-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-herb-green-600 animate-spin mb-3" />
            <p className="font-display text-gray-400">กำลังโหลดสินค้า...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌿</p>
            <p className="font-display text-gray-400 text-lg">ยังไม่มีสินค้าในหมวดนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => {
              const isAdded = addedId === product._id
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-100 group transition-all duration-300"
                >
                  {/* รูปสินค้า */}
                  <div className="relative h-52 bg-herb-green-50 overflow-hidden">
                    {product.badge && BADGE_LABELS[product.badge] && (
                      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-display font-bold z-10 ${BADGE_STYLES[product.badge]}`}>
                        {BADGE_LABELS[product.badge]}
                      </div>
                    )}
                    {product.tag && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs font-display text-gray-600 font-medium z-10">
                        {product.tag}
                      </div>
                    )}
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">📦</div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                        <span className="bg-gray-700 text-white font-display font-bold text-sm px-4 py-2 rounded-full">สินค้าหมด</span>
                      </div>
                    )}
                  </div>

                  {/* ข้อมูลสินค้า */}
                  <div className="p-5">
                    <div className="mb-2">
                      <h3 className="font-display font-bold text-herb-dark text-base leading-tight">{product.name}</h3>
                      {product.nameEn && <p className="text-gray-400 text-xs font-display">{product.nameEn}</p>}
                    </div>
                    <p className="text-gray-500 text-sm font-display mb-3 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-herb-gold-500 fill-herb-gold-500" />
                      ))}
                      <span className="text-gray-400 text-xs font-display ml-1">(4.9)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-display font-black text-herb-green-700 text-xl">฿{product.price.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs font-display ml-1">/ ชิ้น</span>
                      </div>
                      {/* ─── ปุ่มเพิ่มลงตะกร้า ─── */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        className={`flex items-center gap-1.5 font-display font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 ${
                          !product.inStock
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : isAdded
                            ? 'bg-herb-green-100 text-herb-green-700 scale-95'
                            : 'bg-herb-green-700 hover:bg-herb-green-800 text-white hover:shadow-md active:scale-95'
                        }`}
                      >
                        {isAdded ? (
                          <><CheckCircle className="w-3.5 h-3.5" />เพิ่มแล้ว!</>
                        ) : product.inStock ? (
                          <><ShoppingCart className="w-3.5 h-3.5" />ใส่ตะกร้า</>
                        ) : (
                          'สินค้าหมด'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-bold px-8 py-4 rounded-full transition-all hover:shadow-xl hover:-translate-y-1"
            >
              ดูผลิตภัณฑ์ทั้งหมด
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
