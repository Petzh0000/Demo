'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  Leaf, LogOut, RefreshCw, Package, Search,
  Eye, X, CheckCircle, Truck, Clock, XCircle,
  DollarSign, QrCode, ChevronDown
} from 'lucide-react'

interface OrderItem { productId: string; name: string; price: number; quantity: number; imageUrl: string }
interface Customer { name: string; phone: string; address: string; district: string; province: string; postalCode: string }
interface Order {
  _id: string; orderNumber: string; items: OrderItem[]; customer: Customer
  paymentMethod: 'qr' | 'cod'; paymentStatus: 'pending' | 'paid' | 'cancelled'
  orderStatus: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
  totalAmount: number; shippingFee: number; note?: string; slipUrl?: string
  createdAt: string
}

const ORDER_STATUS_CONFIG = {
  pending:   { label: 'รอยืนยัน',   color: 'bg-amber-50 text-amber-700 border-amber-200',         icon: Clock },
  confirmed: { label: 'ยืนยันแล้ว', color: 'bg-blue-50 text-blue-700 border-blue-200',             icon: CheckCircle },
  shipping:  { label: 'กำลังจัดส่ง',color: 'bg-purple-50 text-purple-700 border-purple-200',       icon: Truck },
  delivered: { label: 'จัดส่งแล้ว', color: 'bg-green-50 text-green-700 border-green-200',          icon: CheckCircle },
  cancelled: { label: 'ยกเลิก',      color: 'bg-red-50 text-red-600 border-red-200',                icon: XCircle },
}
const PAYMENT_STATUS_CONFIG = {
  pending:   { label: 'รอชำระ',   color: 'bg-amber-50 text-amber-600' },
  paid:      { label: 'ชำระแล้ว', color: 'bg-green-50 text-green-600' },
  cancelled: { label: 'ยกเลิก',   color: 'bg-red-50 text-red-500' },
}
const ORDER_STATUS_FLOW: Array<Order['orderStatus']> = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']

// ─── Status badge label + color ───
const STATUS_NEXT_ACTION: Record<string, { label: string; color: string; next: Order['orderStatus'] } | null> = {
  pending:   { label: '✅ ยืนยันออเดอร์',  color: 'bg-amber-500 hover:bg-amber-600 text-white', next: 'confirmed' },
  confirmed: { label: '🚚 ส่งสินค้าแล้ว',  color: 'bg-blue-500 hover:bg-blue-600 text-white',   next: 'shipping' },
  shipping:  { label: '📦 จัดส่งสำเร็จ',  color: 'bg-green-600 hover:bg-green-700 text-white',  next: 'delivered' },
  delivered: null,
  cancelled: null,
}

// ─── Dropdown component แบบ portal-like ไม่ถูก clip ───
function StatusDropdown({
  order,
  onUpdate,
  disabled,
}: {
  order: Order
  onUpdate: (id: string, patch: Partial<Order>) => void
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0 })

  // คำนวณตำแหน่งจาก button position
  const handleOpen = () => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    })
    setOpen(v => !v)
  }

  // ปิดเมื่อ click นอก
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const sc = ORDER_STATUS_CONFIG[order.orderStatus]

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-display font-semibold transition-all disabled:opacity-50 cursor-pointer hover:shadow-sm ${sc.color}`}
        title="คลิกเพื่อเปลี่ยนสถานะ"
      >
        <sc.icon className="w-3 h-3" />
        {sc.label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown — render ด้วย fixed position เพื่อหนีออกจาก overflow:hidden */}
      {open && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
          className="w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <p className="font-display font-bold text-gray-500 text-xs uppercase tracking-wider">เปลี่ยนสถานะ</p>
          </div>
          {ORDER_STATUS_FLOW.map(s => {
            const cfg = ORDER_STATUS_CONFIG[s]
            const StatusIcon = cfg.icon
            const isCurrent = order.orderStatus === s
            return (
              <button
                key={s}
                disabled={isCurrent || disabled}
                onClick={() => {
                  onUpdate(order._id, { orderStatus: s })
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-display transition-colors text-left ${
                  isCurrent
                    ? 'bg-herb-green-50 text-herb-green-700 font-bold cursor-default'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <StatusIcon className="w-3.5 h-3.5 flex-shrink-0" />
                {cfg.label}
                {isCurrent && <span className="ml-auto text-herb-green-500 text-xs">● ปัจจุบัน</span>}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [adminSecret, setAdminSecret] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const secret = sessionStorage.getItem('adminSecret')
    if (!secret) { router.push('/admin'); return }
    setAdminSecret(secret)
  }, [router])

  const fetchOrders = useCallback(async () => {
    if (!adminSecret) return
    setLoading(true)
    try {
      const url = filterStatus !== 'all' ? `/api/orders?status=${filterStatus}` : '/api/orders'
      const res = await fetch(url, { headers: { 'x-admin-secret': adminSecret } })
      const data = await res.json()
      if (data.success) setOrders(data.orders)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }, [adminSecret, filterStatus])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = orders.filter(o =>
    !search ||
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
    o.customer.phone.includes(search)
  )

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.totalAmount, 0),
    unpaid: orders.filter(o => o.paymentStatus === 'pending' && o.paymentMethod === 'qr').length,
  }

  const updateOrder = async (id: string, patch: Partial<Order>) => {
    setUpdating(id)
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (data.success) {
        setOrders(prev => prev.map(o => o._id === id ? { ...o, ...patch } : o))
        if (selectedOrder?._id === id) setSelectedOrder(prev => prev ? { ...prev, ...patch } : null)
      } else alert('อัพเดทไม่สำเร็จ: ' + data.message)
    } catch { alert('เกิดข้อผิดพลาด') } finally { setUpdating(null) }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('th-TH', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-herb-green-700 rounded-full flex items-center justify-center">
              <Leaf className="text-white w-3.5 h-3.5" />
            </div>
            <Link href="/admin/products" className="font-display text-gray-500 text-sm hover:text-herb-green-700">Admin</Link>
            <span className="text-gray-300">/</span>
            <span className="font-display text-herb-green-700 text-sm font-bold">ออเดอร์</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="font-display text-sm text-gray-500 hover:text-herb-green-700">📦 สินค้า</Link>
            <button
              onClick={() => { sessionStorage.removeItem('adminSecret'); router.push('/admin') }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 font-display text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />ออก
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'ออเดอร์ทั้งหมด', value: stats.total,                   icon: Package,     color: 'text-herb-green-700', bg: 'bg-herb-green-50' },
            { label: 'รอยืนยัน',        value: stats.pending,                  icon: Clock,       color: 'text-amber-600',      bg: 'bg-amber-50' },
            { label: 'รอตรวจสลิป',      value: stats.unpaid,                   icon: QrCode,      color: 'text-blue-600',       bg: 'bg-blue-50' },
            { label: 'ยอดรับชำระ',      value: `฿${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600',     bg: 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="font-display font-black text-herb-dark text-2xl">{s.value}</p>
              <p className="font-display text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="ค้นหาเลขออเดอร์, ชื่อ, เบอร์..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            {['all', ...ORDER_STATUS_FLOW].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-xl font-display font-medium text-xs transition-all ${
                  filterStatus === s
                    ? 'bg-herb-green-700 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-herb-green-300'
                }`}
              >
                {s === 'all' ? 'ทั้งหมด' : ORDER_STATUS_CONFIG[s as keyof typeof ORDER_STATUS_CONFIG]?.label}
              </button>
            ))}
            <button
              onClick={fetchOrders}
              className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 font-display text-sm px-3 py-2 rounded-xl hover:border-herb-green-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-4xl animate-spin">🌿</div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-display text-gray-400">ไม่พบออเดอร์</p>
            </div>
          ) : (
            /* ลบ overflow-x-auto ออก แล้วใช้ scroll บน wrapper แทน */
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['เลขออเดอร์', 'ลูกค้า', 'สินค้า', 'ยอด / วิธีชำระ', 'สถานะชำระ', 'สถานะออเดอร์', 'วันที่', ''].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-display font-semibold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(order => {
                    const pc = PAYMENT_STATUS_CONFIG[order.paymentStatus]
                    const nextAction = STATUS_NEXT_ACTION[order.orderStatus]
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                        {/* เลขออเดอร์ */}
                        <td className="px-4 py-3.5">
                          <span className="font-display font-bold text-herb-green-700 text-xs bg-herb-green-50 px-2 py-1 rounded-lg">
                            {order.orderNumber}
                          </span>
                        </td>

                        {/* ลูกค้า */}
                        <td className="px-4 py-3.5">
                          <p className="font-display font-semibold text-herb-dark text-sm">{order.customer.name}</p>
                          <p className="font-display text-gray-400 text-xs">{order.customer.phone}</p>
                        </td>

                        {/* สินค้า */}
                        <td className="px-4 py-3.5">
                          <div className="flex -space-x-2 mb-1">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-7 h-7 rounded-full overflow-hidden bg-herb-green-50 border-2 border-white flex-shrink-0">
                                {item.imageUrl
                                  ? <Image src={item.imageUrl} alt="" width={28} height={28} className="object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center text-xs">📦</div>}
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-display font-bold text-gray-500">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <p className="font-display text-gray-400 text-xs">{order.items.length} รายการ</p>
                        </td>

                        {/* ยอด + วิธีชำระ */}
                        <td className="px-4 py-3.5">
                          <p className="font-display font-black text-herb-green-700">฿{order.totalAmount.toLocaleString()}</p>
                          <span className={`inline-block text-xs font-display font-medium px-1.5 py-0.5 rounded mt-0.5 ${order.paymentMethod === 'qr' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                            {order.paymentMethod === 'qr' ? '📱 QR' : '🚚 COD'}
                          </span>
                        </td>

                        {/* สถานะชำระ */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-col gap-1.5">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-display font-semibold w-fit ${pc.color}`}>
                              {pc.label}
                            </span>
                            {order.slipUrl && (
                              <a href={order.slipUrl} target="_blank" rel="noopener noreferrer"
                                className="text-blue-500 text-xs font-display hover:underline">
                                ดูสลิป ↗
                              </a>
                            )}
                            {order.paymentStatus === 'pending' && order.paymentMethod === 'qr' && (
                              <button
                                onClick={() => updateOrder(order._id, { paymentStatus: 'paid' })}
                                disabled={!!updating}
                                className="text-herb-green-700 text-xs font-display font-semibold hover:underline text-left w-fit"
                              >
                                ✅ ยืนยันชำระ
                              </button>
                            )}
                          </div>
                        </td>

                        {/* สถานะออเดอร์ — dropdown คลิก ลอยพ้นตาราง */}
                        <td className="px-4 py-3.5">
                          <StatusDropdown
                            order={order}
                            onUpdate={updateOrder}
                            disabled={!!updating}
                          />
                        </td>

                        {/* วันที่ */}
                        <td className="px-4 py-3.5">
                          <span className="font-display text-gray-500 text-xs whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {/* Quick next step */}
                            {nextAction && (
                              <button
                                onClick={() => updateOrder(order._id, { orderStatus: nextAction.next })}
                                disabled={!!updating}
                                className={`text-xs font-display font-semibold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap disabled:opacity-50 ${nextAction.color}`}
                              >
                                {nextAction.label}
                              </button>
                            )}
                            {/* View detail */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="w-8 h-8 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 text-gray-500 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
                              title="ดูรายละเอียด"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── Order Detail Modal ─── */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-display font-extrabold text-herb-dark">{selectedOrder.orderNumber}</h3>
                <p className="font-display text-gray-400 text-xs">{formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Status badges */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-display text-gray-400 text-xs mb-1.5">สถานะออเดอร์</p>
                  <StatusDropdown order={selectedOrder} onUpdate={updateOrder} disabled={!!updating} />
                </div>
                <div>
                  <p className="font-display text-gray-400 text-xs mb-1.5">สถานะชำระ</p>
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-display font-semibold ${PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].color}`}>
                    {PAYMENT_STATUS_CONFIG[selectedOrder.paymentStatus].label}
                  </span>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="font-display font-bold text-herb-dark text-sm mb-2">👤 ข้อมูลลูกค้า</p>
                <p className="font-display text-gray-700 text-sm font-semibold">{selectedOrder.customer.name}</p>
                <p className="font-display text-gray-500 text-sm">📞 {selectedOrder.customer.phone}</p>
                <p className="font-display text-gray-500 text-sm mt-1">
                  📍 {selectedOrder.customer.address}, {selectedOrder.customer.district}, {selectedOrder.customer.province} {selectedOrder.customer.postalCode}
                </p>
                {selectedOrder.note && (
                  <p className="font-display text-amber-600 text-xs mt-2 bg-amber-50 px-3 py-1.5 rounded-lg">
                    📝 {selectedOrder.note}
                  </p>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="font-display font-bold text-herb-dark text-sm mb-3">🛒 รายการสินค้า</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-herb-green-50 flex-shrink-0">
                        {item.imageUrl
                          ? <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-medium text-herb-dark text-sm">{item.name}</p>
                        <p className="font-display text-gray-400 text-xs">฿{item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <span className="font-display font-bold text-herb-green-700 text-sm">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-herb-green-50 rounded-xl p-4">
                <div className="flex justify-between font-display text-sm text-gray-600 mb-2">
                  <span>วิธีชำระ</span>
                  <span className="font-semibold">
                    {selectedOrder.paymentMethod === 'qr' ? '📱 QR PromptPay' : '🚚 เก็บเงินปลายทาง'}
                  </span>
                </div>
                <div className="flex justify-between font-display font-black text-herb-dark text-lg border-t border-herb-green-200 pt-2">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-herb-green-700">฿{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Slip */}
              {selectedOrder.slipUrl && (
                <div>
                  <p className="font-display font-bold text-herb-dark text-sm mb-2">📎 สลิปการโอน</p>
                  <a href={selectedOrder.slipUrl} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={selectedOrder.slipUrl}
                      alt="slip"
                      width={200}
                      height={280}
                      className="rounded-xl border border-gray-200 hover:opacity-80 transition-opacity"
                    />
                  </a>
                </div>
              )}

              {/* Quick actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                {selectedOrder.paymentStatus === 'pending' && selectedOrder.paymentMethod === 'qr' && (
                  <button
                    onClick={() => updateOrder(selectedOrder._id, { paymentStatus: 'paid' })}
                    disabled={!!updating}
                    className="flex items-center gap-1.5 bg-herb-green-700 hover:bg-herb-green-800 text-white font-display font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />ยืนยันชำระเงิน
                  </button>
                )}
                {STATUS_NEXT_ACTION[selectedOrder.orderStatus] && (
                  <button
                    onClick={() => updateOrder(selectedOrder._id, { orderStatus: STATUS_NEXT_ACTION[selectedOrder.orderStatus]!.next })}
                    disabled={!!updating}
                    className={`flex items-center gap-1.5 font-display font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50 ${STATUS_NEXT_ACTION[selectedOrder.orderStatus]!.color}`}
                  >
                    {STATUS_NEXT_ACTION[selectedOrder.orderStatus]!.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
