/**
 * 📁 src/lib/telegram.ts
 * -------------------------------------------------------
 * ส่งแจ้งเตือนเข้า Telegram เมื่อมีออเดอร์ใหม่
 *
 * 📌 ตั้งค่าใน .env.local (ใส่แล้วรัน npm run dev ใหม่):
 *   TELEGRAM_BOT_TOKEN=8588629019:AAG2MZp35WIK_Ilhqxstx6hOCizu332IH1c
 *   TELEGRAM_CHAT_ID=1315773440
 *
 * 📌 วิธีแก้ข้อความแจ้งเตือน:
 *   แก้ในฟังก์ชัน buildMessage() ด้านล่างได้เลย
 *   ใช้ Markdown แบบธรรมดา: *ตัวหนา* และ `code`
 *
 * 📌 ถ้าอยากส่งแจ้งเตือนเพิ่มเติมในที่อื่น เช่น ตอน upload สลิป:
 *   import { sendTelegramMessage } from '@/lib/telegram'
 *   sendTelegramMessage('ลูกค้าส่งสลิปแล้ว!')
 * -------------------------------------------------------
 */

export interface OrderNotifyPayload {
  orderNumber: string
  customerName: string
  customerPhone: string
  items: { name: string; quantity: number; price: number }[]
  totalAmount: number
  paymentMethod: 'qr' | 'cod'
  address: string
}

// ─── สร้างข้อความแจ้งเตือน ───
// แก้ที่นี่เพื่อเปลี่ยนรูปแบบข้อความ
function buildMessage(order: OrderNotifyPayload): string {
  const paymentLabel =
    order.paymentMethod === 'qr'
      ? '📱 QR PromptPay (รอตรวจสลิป)'
      : '🚚 เก็บเงินปลายทาง (COD)'

  const itemLines = order.items
    .map(i => `  • ${i.name} x${i.quantity}  (฿${(i.price * i.quantity).toLocaleString()})`)
    .join('\n')

  return [
    '🛒 *มีออเดอร์ใหม่เข้ามา!*',
    '',
    `📋 *เลขออเดอร์:* ${order.orderNumber}`,
    `👤 *ลูกค้า:* ${order.customerName}`,
    `📞 *เบอร์:* ${order.customerPhone}`,
    '',
    '*รายการสินค้า:*',
    itemLines,
    '',
    `💰 *ยอดรวม:* ฿${order.totalAmount.toLocaleString()}`,
    `💳 *ชำระด้วย:* ${paymentLabel}`,
    '',
    `📍 *จัดส่งไปที่:* ${order.address}`,
    '',
    '👉 เข้าจัดการที่ /admin/orders',
  ].join('\n')
}

// ─── ส่งข้อความ raw ไป Telegram (ใช้เรียกจากที่อื่นได้ด้วย) ───
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.warn('⚠️  [Telegram] ไม่พบ TELEGRAM_BOT_TOKEN หรือ TELEGRAM_CHAT_ID ใน .env.local')
    return
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',           // ← ใช้ Markdown ธรรมดา ไม่ใช่ MarkdownV2
          disable_web_page_preview: true,
        }),
      }
    )

    const data = await res.json()
    if (!data.ok) {
      console.error('❌ [Telegram] ส่งไม่สำเร็จ:', data.description)
    } else {
      console.log('✅ [Telegram] แจ้งเตือนสำเร็จ message_id:', data.result?.message_id)
    }
  } catch (err) {
    // ไม่ throw — ให้ระบบออเดอร์ทำงานต่อได้แม้ Telegram ล่ม
    console.error('❌ [Telegram] Error:', err)
  }
}

// ─── แจ้งเตือนออเดอร์ใหม่ (เรียกจาก POST /api/orders) ───
// ไม่ await เจตนา → ทำงาน background ไม่ทำให้ response ช้า
export function sendTelegramNotify(order: OrderNotifyPayload): void {
  sendTelegramMessage(buildMessage(order)).catch(err =>
    console.error('❌ [Telegram] sendTelegramNotify failed:', err)
  )
}
