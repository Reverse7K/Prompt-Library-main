'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SearchBox, { type Suggestion } from '@/app/components/SearchBox'
import { promptSearchFilter } from '@/lib/promptSearch'

export default function SearchBar({
  initialQuery = '',
  compact = false,
}: {
  initialQuery?: string
  compact?: boolean
}) {
  const router = useRouter()
  const supabase = createClient()

  /*
    ใช้เงื่อนไขชุดเดียวกับหน้า /search รายการแนะนำจึงเป็นผลการค้นหาจริง ๆ ไม่ใช่คนละชุด
    เอาแค่ 6 รายการพอ ไม่ให้ลิสต์ยาวจนบังหน้าเว็บ
  */
  async function fetchSuggestions(keyword: string): Promise<Suggestion[]> {
    const { data } = await supabase
      .from('prompts')
      .select('prompt_id, title, categories(name)')
      .eq('is_public', true)
      .or(promptSearchFilter(keyword))
      .order('created_at', { ascending: false })
      .limit(6)

    return ((data ?? []) as unknown as {
      prompt_id: string
      title: string
      categories: { name: string } | null
    }[]).map((row) => ({
      id: row.prompt_id,
      label: row.title,
      hint: row.categories?.name ?? undefined,
    }))
  }

  return (
    <SearchBox
      value={initialQuery}
      placeholder="ค้นหา prompt..."
      className={compact ? 'w-40 sm:w-56' : 'w-full'}
      fetchSuggestions={fetchSuggestions}
      // เลือกรายการแนะนำ = รู้อยู่แล้วว่าจะเอาอันไหน พาไปหน้านั้นเลยไม่ต้องผ่านหน้าผลค้นหา
      onPick={(item) => router.push(`/prompts/${item.id}`)}
      onSearch={(kw) => {
        if (kw) router.push(`/search?q=${encodeURIComponent(kw)}`)
      }}
    />
  )
}
