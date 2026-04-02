/**
 * 📁 src/lib/models/PageContent.ts
 * เก็บเนื้อหาหน้าต่างๆ ที่แก้ไขได้จาก Admin
 *
 * slug คือ key เช่น 'about', 'vision', 'awards', 'news-1', 'blog-1'
 * content เป็น JSON object ที่แต่ละหน้าใช้ต่างกัน
 */
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPageContent extends Document {
  slug: string        // unique key เช่น 'about', 'vision'
  title: string       // ชื่อหน้า สำหรับแสดงใน Admin
  content: Record<string, any>  // JSON เนื้อหา
  updatedAt: Date
}

const pageContentSchema = new Schema<IPageContent>(
  {
    slug:    { type: String, required: true, unique: true, trim: true },
    title:   { type: String, required: true },
    content: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

const PageContent: Model<IPageContent> =
  mongoose.models.PageContent ||
  mongoose.model<IPageContent>('PageContent', pageContentSchema)

export default PageContent
