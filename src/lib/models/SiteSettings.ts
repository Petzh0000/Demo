/**
 * 📁 src/lib/models/SiteSettings.ts
 * เก็บการตั้งค่าเว็บไซต์ (logo, ชื่อแบรนด์ ฯลฯ)
 * ใช้ singleton pattern — มีแค่ 1 document เสมอ (key: 'main')
 *
 * 📌 วิธีเพิ่ม setting ใหม่:
 *   เพิ่มฟิลด์ใน schema + ISiteSettings
 */
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISiteSettings extends Document {
  key: string         // 'main' เสมอ
  logoUrl: string     // URL รูป logo จาก Cloudinary
  logoPublicId: string
  brandName: string
  brandNameEn: string
  updatedAt: Date
}

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    key:           { type: String, default: 'main', unique: true },
    logoUrl:       { type: String, default: '' },
    logoPublicId:  { type: String, default: '' },
    brandName:     { type: String, default: 'สมุนไพรไทย' },
    brandNameEn:   { type: String, default: 'Thai Herb' },
  },
  { timestamps: true }
)

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema)

export default SiteSettings
