/**
 * 📁 src/lib/cloudinary.ts
 * -------------------------------------------------------
 * Utility สำหรับจัดการรูปภาพผ่าน Cloudinary
 *
 * 📌 ฟังก์ชันที่มี:
 *   - uploadImage()  : อัพโหลดรูปไป Cloudinary
 *   - deleteImage()  : ลบรูปออกจาก Cloudinary (ใช้ตอนลบสินค้า)
 *
 * 📌 วิธีสมัคร Cloudinary:
 *   1. ไปที่ https://cloudinary.com
 *   2. สมัคร Free tier (ฟรี 25GB)
 *   3. ไปที่ Dashboard > API Keys
 *   4. Copy: Cloud Name, API Key, API Secret
 *   5. ใส่ใน .env.local
 *
 * 📌 โครงสร้างใน Cloudinary:
 *   herb-store/products/ → เก็บรูปสินค้าทั้งหมด
 * -------------------------------------------------------
 */

import { v2 as cloudinary } from 'cloudinary'

// ตั้งค่า Cloudinary (ใช้ env variables)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * อัพโหลดรูปไป Cloudinary
 * @param file - File object จาก FormData
 * @returns { url, publicId } - URL และ ID สำหรับใช้ในภายหลัง
 */
export async function uploadImage(file: File): Promise<{
  url: string
  publicId: string
}> {
  // แปลง File เป็น ArrayBuffer → Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  return new Promise((resolve, reject) => {
    // ใช้ upload_stream เพราะ Next.js API Route ไม่มี filesystem
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'herb-store/products',   // เก็บใน folder นี้ใน Cloudinary
        resource_type: 'image',
        // Auto optimize: แปลงเป็น WebP และ resize ถ้าใหญ่เกิน
        transformation: [
          { width: 800, height: 800, crop: 'limit' }, // ไม่ใหญ่กว่า 800x800
          { quality: 'auto' },                         // auto quality
          { fetch_format: 'auto' },                    // แปลงเป็น WebP อัตโนมัติ
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'))
          return
        }
        resolve({
          url: result.secure_url,       // HTTPS URL สำหรับแสดงรูป
          publicId: result.public_id,   // ID สำหรับลบรูปในภายหลัง
        })
      }
    )
    uploadStream.end(buffer)
  })
}

/**
 * ลบรูปออกจาก Cloudinary
 * @param publicId - public_id ที่ได้จาก uploadImage()
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!publicId) return
  await cloudinary.uploader.destroy(publicId)
}

export default cloudinary
