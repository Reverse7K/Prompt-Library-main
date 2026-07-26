import type { Metadata } from 'next'
import { Prompt, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/app/components/Navbar'
import Toaster from '@/app/components/Toast'
import './globals.css'

// ฟอนต์หลักทั้งเว็บ (ไทย + ละติน) — Prompt ไม่ใช่ variable font จึงต้องระบุน้ำหนักเป็น array
const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-prompt',
})

// ตัวเลข/ภาษาอังกฤษ — โทนเทอร์มินัลให้เข้ากับธีม
// เป็น variable font (แกน wght 100–800) จึงโหลดไฟล์เดียวได้ครบทุกน้ำหนัก
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Prompt Library',
  description: 'รวม Prompt AI สำหรับสร้างรูปภาพ วิดีโอ งานนำเสนอ และอื่นๆ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${prompt.variable} ${jetbrains.variable}`}>
      <body className="bg-[#0a0a0f] text-[#f2f2f7] font-sans min-h-screen antialiased">
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
