/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ Cloudinary - สำหรับรูปสินค้าที่ upload ผ่าน Cloudinary
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      // ✅ Placeholder - สำหรับ dev/testing
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}

module.exports = nextConfig
