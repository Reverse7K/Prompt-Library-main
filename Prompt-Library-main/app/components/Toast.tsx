'use client'

import { useEffect, useState } from 'react'

type ToastItem = { id: number; message: string; tone: 'ok' | 'error' }

let nextId = 1
const listeners = new Set<(toast: ToastItem) => void>()

// อยู่นอก component เพื่อให้เรียกจากที่ไหนก็ได้ฝั่ง client โดยไม่ต้องส่ง prop ลงไปเป็นทอด ๆ
export function showToast(message: string, tone: ToastItem['tone'] = 'ok') {
  const toast: ToastItem = { id: nextId++, message, tone }
  listeners.forEach((listener) => listener(toast))
}

const VISIBLE_MS = 2400

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    function handle(toast: ToastItem) {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, VISIBLE_MS)
    }

    listeners.add(handle)
    return () => {
      listeners.delete(handle)
    }
  }, [])

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`animate-toast-in flex items-center gap-2.5 rounded-xl border px-4 py-3 font-mono text-sm backdrop-blur ${
            toast.tone === 'ok'
              ? 'border-cyan-400/60 bg-[#0b1520]/95 text-cyan-200 shadow-[0_12px_40px_-10px_rgba(0,229,255,0.55)]'
              : 'border-fuchsia-400/60 bg-[#1a0b16]/95 text-fuchsia-200 shadow-[0_12px_40px_-10px_rgba(255,62,200,0.5)]'
          }`}
        >
          {toast.tone === 'ok' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  )
}
