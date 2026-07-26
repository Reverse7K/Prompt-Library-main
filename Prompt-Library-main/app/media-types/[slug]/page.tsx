import { createClient } from '@/lib/supabase/server'
import PromptCard from '@/app/components/PromptCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function MediaTypeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: mediaType } = await supabase
    .from('media_types')
    .select('media_type_id, name, slug')
    .eq('slug', slug)
    .single()

  if (!mediaType) notFound()

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*, categories(name), media_types(name)')
    .eq('media_type_id', mediaType.media_type_id)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/media-types" className="text-sm text-accent hover:underline font-mono">
        ← กลับไปประเภทสื่อ
      </Link>

      <h1
        className="section-title text-4xl font-extrabold mt-4 mb-8"
      >
        {mediaType.name}
      </h1>

      {error && <p className="text-accent2">เกิดข้อผิดพลาด: {error.message}</p>}

      {prompts && prompts.length === 0 && (
        <p className="text-muted font-mono text-sm py-12 text-center">
          {'>'} ยังไม่มี Prompt ในประเภทสื่อนี้
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {prompts?.map((prompt, i) => (
          <PromptCard key={prompt.prompt_id} prompt={prompt} index={i} />
        ))}
      </div>
    </div>
  )
}