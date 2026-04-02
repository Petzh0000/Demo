/**
 * 📁 src/lib/models/Slide.ts
 * Hero Slideshow — จัดการรูปสไลด์จาก Admin
 *
 * 📌 ฟิลด์:
 *   imageUrl     : URL รูปจาก Cloudinary
 *   imagePublicId: สำหรับลบรูปใน Cloudinary
 *   order        : ลำดับการแสดง (น้อย = แสดงก่อน)
 *   isVisible    : แสดง/ซ่อน
 */
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISlide extends Document {
  imageUrl: string
  imagePublicId: string
  order: number
  isVisible: boolean
  createdAt: Date
}

const slideSchema = new Schema<ISlide>(
  {
    imageUrl:      { type: String, required: true },
    imagePublicId: { type: String, default: '' },
    order:         { type: Number, default: 0 },
    isVisible:     { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Slide: Model<ISlide> =
  mongoose.models.Slide || mongoose.model<ISlide>('Slide', slideSchema)

export default Slide
