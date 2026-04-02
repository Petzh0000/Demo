/**
 * GET  /api/site-settings       → ดึง settings (public)
 * PUT  /api/site-settings       → อัพเดท (admin) รับ JSON หรือ FormData (ถ้า upload logo)
 */
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import SiteSettings from '@/lib/models/SiteSettings'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await dbConnect()
    let settings = await SiteSettings.findOne({ key: 'main' })
    if (!settings) settings = await SiteSettings.create({ key: 'main' })
    return NextResponse.json({ success: true, settings })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const secret = request.headers.get('x-admin-secret')
    if (secret !== process.env.ADMIN_SECRET)
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    await dbConnect()
    const contentType = request.headers.get('content-type') || ''

    let patch: Record<string, any> = {}

    if (contentType.includes('multipart/form-data')) {
      // Upload logo
      const formData = await request.formData()
      const file = formData.get('logo') as File | null
      const brandName = formData.get('brandName') as string
      const brandNameEn = formData.get('brandNameEn') as string

      if (brandName) patch.brandName = brandName
      if (brandNameEn) patch.brandNameEn = brandNameEn

      if (file) {
        // ลบ logo เก่าออกก่อน
        const old = await SiteSettings.findOne({ key: 'main' })
        if (old?.logoPublicId) await deleteImage(old.logoPublicId)

        const { url, publicId } = await uploadImage(file)
        patch.logoUrl = url
        patch.logoPublicId = publicId
      }
    } else {
      patch = await request.json()
    }

    const settings = await SiteSettings.findOneAndUpdate(
      { key: 'main' },
      patch,
      { new: true, upsert: true }
    )
    return NextResponse.json({ success: true, settings })
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 })
  }
}
