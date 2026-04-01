/**
 * 📁 src/lib/mongodb.ts
 * -------------------------------------------------------
 * ไฟล์นี้จัดการการเชื่อมต่อกับ MongoDB Atlas
 *
 * ใช้ Singleton Pattern เพื่อไม่ให้สร้าง connection ใหม่
 * ทุกครั้งที่เรียก API (Node.js Hot Reload ใน dev mode)
 *
 * 📌 วิธีใช้:
 *   import dbConnect from '@/lib/mongodb'
 *   await dbConnect()
 * -------------------------------------------------------
 */

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    '❌ กรุณาตั้งค่า MONGODB_URI ในไฟล์ .env.local\n' +
    '   ดูตัวอย่างได้ที่ .env.local'
  )
}

// ใช้ global เพื่อ cache connection ระหว่าง hot reloads
let cached = (global as any).mongoose
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  // ถ้า connect แล้ว return ทันที
  if (cached.conn) return cached.conn

  // ถ้ายังไม่มี promise สร้างใหม่
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'herb_store', // ชื่อ database ใน MongoDB Atlas (เปลี่ยนได้)
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts)
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
