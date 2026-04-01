'use client'
/**
 * 📁 src/components/admin/ProductForm.tsx
 * -------------------------------------------------------
 * Form สำหรับเพิ่ม/แก้ไขสินค้า (ใช้ร่วมกันทั้ง new และ edit)
 *
 * 📌 Props:
 *   - initialData  : ข้อมูลสินค้าสำหรับ edit (ถ้าไม่มี = new)
 *   - adminSecret  : สำหรับ auth API calls
 *   - onSuccess    : callback เมื่อ save สำเร็จ
 *
 * 📌 วิธีเพิ่มฟิลด์ใหม่:
 *   1. เพิ่ม key ใน formData state
 *   2. เพิ่ม <input> หรือ <select> ใน JSX
 *   3. เพิ่มฟิลด์ใน Product model (src/lib/models/Product.ts)
 *
 * 📌 Image Upload Flow:
 *   เลือกรูป → Preview → กด Save → อัพโหลดรูป → สร้าง/แก้ไขสินค้า
 * -------------------------------------------------------
 */

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react'

interface ProductFormData {
  name: string
  nameEn: string
  description: string
  price: string
  category: string
  badge: string
  tag: string
  inStock: boolean
  isVisible: boolean
  imageUrl: string
  imagePublicId: string
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { _id?: string }
  adminSecret: string
  onSuccess: (product: any) => void
}

export default function ProductForm({ initialData, adminSecret, onSuccess }: ProductFormProps) {
  const isEdit = !!initialData?._id

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    nameEn: initialData?.nameEn || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() || '',
    category: initialData?.category || 'massage',
    badge: initialData?.badge || '',
    tag: initialData?.tag || '',
    inStock: initialData?.inStock ?? true,
    isVisible: initialData?.isVisible ?? true,
    imageUrl: initialData?.imageUrl || '',
    imagePublicId: initialData?.imagePublicId || '',
  })

  // สำหรับ Image Upload
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.imageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<ProductFormData>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── เปลี่ยนค่า field ทั่วไป ───
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    // clear error เมื่อพิมพ์
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // ─── เลือกรูปภาพ ───
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น')
      return
    }
    // ตรวจสอบขนาด (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 10MB')
      return
    }

    setImageFile(file)
    // สร้าง preview URL จาก local file
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  // ─── ลบรูปที่เลือก ───
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(isEdit ? formData.imageUrl : '') // edit → กลับรูปเดิม, new → ล้าง
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ─── Validate Form ───
  const validate = (): boolean => {
    const newErrors: Partial<ProductFormData> = {}
    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อสินค้า'
    if (!formData.description.trim()) newErrors.description = 'กรุณากรอกรายละเอียด'
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = 'กรุณากรอกราคาที่ถูกต้อง'
    }
    if (!imagePreview && !imageFile) newErrors.imageUrl = 'กรุณาอัพโหลดรูปสินค้า'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ─── Submit Form ───
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      let imageUrl = formData.imageUrl
      let imagePublicId = formData.imagePublicId

      // STEP 1: อัพโหลดรูปก่อน (ถ้ามีรูปใหม่)
      if (imageFile) {
        setUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('image', imageFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'x-admin-secret': adminSecret },
          body: uploadFormData,
        })
        const uploadData = await uploadRes.json()
        setUploading(false)

        if (!uploadData.success) {
          throw new Error('อัพโหลดรูปไม่สำเร็จ: ' + uploadData.message)
        }
        imageUrl = uploadData.url
        imagePublicId = uploadData.publicId
      }

      // STEP 2: Save ข้อมูลสินค้าไป MongoDB
      const payload = {
        ...formData,
        price: Number(formData.price),
        imageUrl,
        imagePublicId,
      }

      const url = isEdit ? `/api/products/${initialData!._id}` : '/api/products'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminSecret,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!data.success) throw new Error(data.message)

      onSuccess(data.product)
    } catch (err: any) {
      alert('เกิดข้อผิดพลาด: ' + err.message)
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ──────────── รูปสินค้า ──────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-display font-bold text-herb-dark mb-4 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-herb-green-600" />
          รูปสินค้า <span className="text-red-500">*</span>
        </h3>

        <p className="text-gray-400 font-display text-xs mb-4">
          📌 รองรับ JPG, PNG, WebP | ขนาดสูงสุด 10MB | แนะนำ 800×800px
          <br />รูปจะถูก optimize อัตโนมัติและเก็บที่ Cloudinary
        </p>

        {imagePreview ? (
          // ─── Preview รูปที่เลือก ───
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-herb-green-200">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={imagePreview.startsWith('blob:')}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              title="เปลี่ยนรูป"
            >
              <X className="w-4 h-4" />
            </button>
            {imageFile && (
              <div className="absolute bottom-2 left-2 bg-herb-green-700 text-white text-[10px] font-display px-2 py-0.5 rounded-full">
                รูปใหม่
              </div>
            )}
          </div>
        ) : (
          // ─── Upload Zone ───
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-48 h-48 border-2 border-dashed border-gray-300 hover:border-herb-green-400 hover:bg-herb-green-50 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all group"
          >
            <Upload className="w-8 h-8 text-gray-300 group-hover:text-herb-green-500 transition-colors" />
            <span className="font-display text-gray-400 group-hover:text-herb-green-600 text-sm text-center px-3">
              คลิกเพื่อเลือกรูป
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        {errors.imageUrl && <p className="text-red-500 text-xs font-display mt-2">{errors.imageUrl}</p>}
      </div>

      {/* ──────────── ข้อมูลสินค้า ──────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-display font-bold text-herb-dark mb-5">ข้อมูลสินค้า</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ชื่อสินค้า (ภาษาไทย) */}
          <div className="sm:col-span-2">
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              ชื่อสินค้า (ภาษาไทย) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="เช่น ยาหม่องสูตรเสลดพังพอน"
              className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 transition-all ${
                errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-herb-green-400'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs font-display mt-1">{errors.name}</p>}
          </div>

          {/* ชื่อสินค้า (ภาษาอังกฤษ) */}
          <div className="sm:col-span-2">
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              ชื่อสินค้า (ภาษาอังกฤษ) <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="nameEn"
              value={formData.nameEn}
              onChange={handleChange}
              placeholder="เช่น Herbal Balm Green Formula"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
            />
          </div>

          {/* รายละเอียด */}
          <div className="sm:col-span-2">
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              รายละเอียดสินค้า <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="อธิบายสรรพคุณ วิธีใช้ และส่วนประกอบของสินค้า..."
              className={`w-full px-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 resize-none transition-all ${
                errors.description ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs font-display mt-1">{errors.description}</p>}
          </div>

          {/* ราคา */}
          <div>
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              ราคา (บาท) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-display text-sm">฿</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="89"
                className={`w-full pl-8 pr-4 py-3 border rounded-xl font-display text-sm focus:outline-none focus:ring-2 focus:ring-herb-green-100 transition-all ${
                  errors.price ? 'border-red-300' : 'border-gray-200 focus:border-herb-green-400'
                }`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs font-display mt-1">{errors.price}</p>}
          </div>

          {/* Tag สูตร */}
          <div>
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              Tag/สูตร <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="เช่น สูตร 1, สูตรพิเศษ"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100"
            />
          </div>

          {/* หมวดหมู่ */}
          <div>
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              หมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 bg-white"
            >
              <option value="massage">💆 กลุ่มยาสำหรับนวด</option>
              <option value="inhale">🌬️ กลุ่มยาสำหรับดม</option>
              <option value="gift">🎁 กลุ่มของชำร่วย</option>
            </select>
          </div>

          {/* Badge */}
          <div>
            <label className="block font-display font-medium text-gray-700 text-sm mb-1.5">
              Badge ป้ายกำกับ
            </label>
            <select
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 bg-white"
            >
              <option value="">ไม่มี</option>
              <option value="bestseller">🔥 ขายดี</option>
              <option value="popular">⭐ ยอดนิยม</option>
              <option value="new">✨ ใหม่</option>
              <option value="premium">👑 พรีเมียม</option>
            </select>
          </div>
        </div>
      </div>

      {/* ──────────── การตั้งค่า ──────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-display font-bold text-herb-dark mb-4">การตั้งค่า</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* inStock Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${formData.inStock ? 'bg-herb-green-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${formData.inStock ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
            <div>
              <div className="font-display font-semibold text-gray-700 text-sm">มีสินค้าในสต็อก</div>
              <div className="font-display text-gray-400 text-xs">ปิดเมื่อสินค้าหมด</div>
            </div>
          </label>

          {/* isVisible Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${formData.isVisible ? 'bg-blue-500' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${formData.isVisible ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
            <div>
              <div className="font-display font-semibold text-gray-700 text-sm">แสดงสินค้าบนเว็บ</div>
              <div className="font-display text-gray-400 text-xs">ปิดเพื่อซ่อนชั่วคราว</div>
            </div>
          </label>
        </div>
      </div>

      {/* ──────────── Submit ──────────── */}
      <button
        type="submit"
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-herb-green-700 hover:bg-herb-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold py-4 rounded-xl transition-all shadow-sm text-base"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {uploading ? 'กำลังอัพโหลดรูป...' : 'กำลังบันทึก...'}
          </>
        ) : (
          isEdit ? '💾 บันทึกการแก้ไข' : '✅ เพิ่มสินค้า'
        )}
      </button>
    </form>
  )
}
